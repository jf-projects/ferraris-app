import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import prisma from '@/prisma/client'; // Adjust path as needed


interface Payment {
    paymentDate: Date | null;
    amount: number;
}

interface Transaction {
    id: number;
    transactionDate: string;
    interestDate?: string | null;
    interest: number;
    incrementValues: string;
    client: any; // Update type according to your actual schema
}

interface Monthly {
    months: number;
    date: string;
    base_amount_due: number;
    month_interest: number;
    total_amount_due: number;
    amount_paid: number;
    year: number;
    month: number;
    unpaid_months: number;
    color: string;
    balance: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


export async function GET() {
    const lotTransactionsWithLatestPayments = await prisma.lotTransaction.findMany({
        where: {
            deletedAt: null, // Include only lot transactions where deletedAt is null
            client: {
                email: {
                    not: '',   // Ensure email is not an empty string
                },
            },
        },
        select: {
            id: true,
            propertyUnit: true,
            propertyUnitAddress: true,
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            payments: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
                select: {
                    id: true,
                    amount: true,
                    paymentDate: true,
                },
            },
        },
    });


    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filteredTransactions = lotTransactionsWithLatestPayments.filter(transaction => {
        const latestPayment = transaction.payments[0];
        if (latestPayment && latestPayment.paymentDate) {
            const paymentDate = new Date(latestPayment.paymentDate);
            return paymentDate < startOfMonth || paymentDate > endOfMonth;
        }
        return true; // Keep transactions with no payments
    });


    const recipients = filteredTransactions.map(async item => {
        const name = capitalize(`${item.client?.firstName} ${item.client?.lastName}`);
        const email = item.client?.email;
        const dueDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const amount = (await calculatePaymentSummary(item.id)).balance;
        try {
            if(amount > 0){
                await sendEmail(name, dueDate, amount, email);
            }
        } catch (error) {
            console.log(error)
        }
    });

    return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
}


const sendEmail = async (name: any, dueDate: number | Date | undefined, amount: string | number | bigint, recipientEmail: any) => {
    // Format amount as currency (PHP - Philippine Peso)
    const formattedAmount = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(amount));

    // Format dueDate as a readable date (e.g., September 5, 2024)
    const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(dueDate);

    const message = `
        <div style="max-width: 600px; margin: auto; padding: 16px; background-color: #ffffff; border: 1px solid #d1d5db;">
            <p style="font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 16px;">Ferraris Ville & Engineers Ville</p>
            
            <p style="font-size: 1.25rem; font-weight: bold; margin-bottom: 16px;">Upcoming Monthly Payment Reminder</p>

            <div>
                <p style="margin-bottom: 16px; text-transform: capitalize;">Hello ${name},</p>

                <p style="margin-bottom: 16px;">
                    We hope this email finds you well. We would like to remind you about your upcoming monthly payment, which is due on:
                </p>

                <p style="margin-bottom: 16px; font-size: 1.125rem; font-weight: 600;">${formattedDate}</p>

                <p style="margin-bottom: 8px; font-weight: bold;">Payment Details:</p>

                <ul style="margin-bottom: 16px; list-style-type: disc; padding-left: 20px;">
                    <li>Amount Due: <span style="font-weight: bold;">${formattedAmount} </span></li>
                    <li>Due Date:<span style="font-weight: bold;"> ${formattedDate}</span></li>
                </ul>

                <p style="margin-bottom: 16px;">
                    Please ensure that your payment is processed by the due date to avoid any late fees.
                </p>

                <p>
                    Thank you for your prompt attention to this matter, and we appreciate your continued partnership with us.
                </p>
            </div>
        </div>
    `;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: recipientEmail,
            subject: "Upcoming Monthly Payment Reminder",
            html: message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


const capitalize = (text: string) => {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};


async function calculatePaymentSummary(tid: number) {
    try {
        const payment = await prisma.payment.findMany({
            where: {
                lotTransactionId: (tid),
                deletedAt: null, // Filter for records where deletedAt is null
            },
            orderBy: { id: 'desc' },
        });

        const transaction = await prisma.lotTransaction.findUnique({
            where: {
                id: (tid),
                deletedAt: null,
            },
            include: {
                client: true,
            },
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        let start_date = transaction?.transactionDate ? new Date(transaction.transactionDate) : new Date();
        start_date.setDate(1);

        let date_now = new Date();

        let interest_start_date = transaction?.interestDate ? new Date(transaction.interestDate) : null;
        if (interest_start_date) {
            interest_start_date.setDate(1);
        }

        let interest = transaction?.interest || 0;
        const monthly_dues = transaction?.incrementValues ? JSON.parse(transaction.incrementValues) : [];

        let compounding_dues = 0;
        let unpaid_months = 0;
        let number_months = 1;

        let lastItem: Monthly | null = null;

        while (start_date <= date_now) {
            let index = Math.floor(number_months / 60);
            let year = start_date.getFullYear();
            let month = start_date.getMonth() + 1;
            let amount_paid_current_month = 0;
            let month_interest = 0;
            let month_balance = 0;
            let cell_color = 'bg-red-100';

            const paymentFound = payment.filter(p => {
                const paymentDate = p.paymentDate;

                if (paymentDate) {
                    return (paymentDate.getMonth() + 1) === month && paymentDate.getFullYear() === year;
                }

                return false;
            });

            if (paymentFound.length > 0) {
                amount_paid_current_month = paymentFound.reduce((sum, p) => sum + Number(p.amount), 0);
                compounding_dues += monthly_dues[index] || 0;
                unpaid_months = 0;
                cell_color = 'bg-green-100';
            } else {
                compounding_dues += monthly_dues[index] || 0;
                unpaid_months++;
            }

            if ((unpaid_months >= 3 && interest_start_date == null) || (unpaid_months >= 3 && interest_start_date && interest_start_date <= start_date)) {
                if (!(start_date.getMonth() === date_now.getMonth() && start_date.getFullYear() === date_now.getFullYear())) {
                    month_interest = Math.round((compounding_dues * (interest / 100)) * 100) / 100;
                }
                compounding_dues = Math.round((compounding_dues + month_interest) * 100) / 100;
            }

            month_balance = compounding_dues - amount_paid_current_month;

            lastItem = {
                months: number_months,
                date: monthNames[month - 1] + ' ' + year,
                base_amount_due: monthly_dues[index] || 0,
                month_interest: month_interest,
                total_amount_due: compounding_dues,
                amount_paid: amount_paid_current_month,
                year: year,
                month: month,
                unpaid_months: unpaid_months,
                color: cell_color,
                balance: month_balance,
            };

            start_date.setMonth(start_date.getMonth() + 1);
            number_months++;
            compounding_dues -= amount_paid_current_month;
        }

        if (!lastItem) {
            throw new Error('No data available');
        }
        return lastItem;

    } catch (error) {
        return {balance: 0};
    }
}