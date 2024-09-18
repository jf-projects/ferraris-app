import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET() {
    try {
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


        const recipients = filteredTransactions.map(item => {
            // Extract name and email
            const name = capitalize(`${item.client?.firstName} ${item.client?.lastName}`);
            
            const email = item.client?.email;

            // Use placeholder values for dueDate and amount
            const dueDate = new Date(); // Placeholder for actual due date
            const amount = 100000; // Placeholder for actual amount

            return { name, dueDate, amount, email };
        });
        return NextResponse.json(recipients);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
    }
}

const capitalize = (text: string) => {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};
