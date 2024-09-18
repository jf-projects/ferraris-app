import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

type Monthly = {
    amount_paid: number;
    month: number;
    year: number;
    base_amount_due: number;
    total_amount_due: number;
    month_interest: number;
    unpaid_months: number;
    months: number;
    balance: number;
    date: string;
    color: string;
};
export async function GET(request: NextRequest, { params }: { params: { tid: string } }) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const payment = await prisma.payment.findMany({
        where: {
            lotTransactionId: parseInt(params.tid),
            deletedAt: null // Filter for records where deletedAt is null
        },
        orderBy: { id: 'desc' },
    });

    const transaction = await prisma.lotTransaction.findUnique({
        where: {
            id: parseInt(params.tid),
            deletedAt: null,
        },
        include: {
            client: true,
        },
    });

    let start_date = transaction?.transactionDate || null;
    if (start_date) {
        start_date.setDate(1)
    }
    let date_now = new Date();

    let interest_start_date = transaction?.interestDate || null;
    if (interest_start_date) {
        interest_start_date.setDate(1)
    }

    let terms = (transaction?.paymentTerms ? Number(transaction?.paymentTerms) : 0) * 12;

    let interest = transaction?.interest ? transaction?.interest : 0;
    const monthly_dues = transaction?.incrementValues ? JSON.parse(transaction.incrementValues) : [];

    let arr_obj: Monthly[] = [];
    let unpaid_months: number = 0;
    let number_months: number = 1;
    let compounding_dues: number = 0;

    const newObj: Monthly = {
        months: 0,
        date: 'Downpayment',
        base_amount_due: 0,
        month_interest: 0,
        total_amount_due: 0,
        amount_paid: Number(transaction?.downpayment),
        balance: 0,
        year: 0,
        month: 0,
        unpaid_months: 0,
        color: 'bg-yellow-100',
    };

    arr_obj.push(newObj);

    if (start_date) {
        while ((start_date <= date_now) && number_months <= terms) {
            
            let index = Math.floor(number_months / 60.1);
            let year = start_date.getFullYear();
            let month = start_date.getMonth() + 1;
            let amount_paid_current_month = 0;
            let month_interest = 0;
            let month_balance = 0;
            let cell_color = 'bg-red-100';


            const paymentFound = payment.filter(p => {
                return (p.paymentDate!.getMonth() + 1) === month && p.paymentDate!.getFullYear() === year;
            });

            // compute compounding
            if (paymentFound.length > 0) {
                amount_paid_current_month = paymentFound.reduce((sum, p) => sum + Number(p.amount), 0);
                compounding_dues = compounding_dues + monthly_dues[index];
                unpaid_months = 0;
                cell_color = 'bg-green-100';
            } else {
                compounding_dues = compounding_dues + monthly_dues[index];
                unpaid_months++;
            }

            // add interest
            if ((unpaid_months >= 3 && interest_start_date == null) || (unpaid_months >= 3 && interest_start_date && interest_start_date <= start_date)) {
                const isSameMonthAndYear = (start_date.getMonth() === date_now.getMonth()) &&
                    (start_date.getFullYear() === date_now.getFullYear());
                if (!isSameMonthAndYear) {
                    month_interest = Math.round((compounding_dues * (interest / 100)) * 100) / 100;
                }
                compounding_dues = Math.round((compounding_dues + month_interest) * 100) / 100;
            }
            month_balance = compounding_dues - amount_paid_current_month;

            const newObj: Monthly = {
                months: number_months,
                date: monthNames[month - 1] + ' ' + year,
                base_amount_due: monthly_dues[index],
                month_interest: month_interest,
                total_amount_due: compounding_dues,
                amount_paid: amount_paid_current_month,
                year: year,
                month: month,
                unpaid_months: unpaid_months,
                color: cell_color,
                balance: month_balance
            };

            arr_obj.push(newObj);

            if(number_months == 300){
                console.log(number_months, start_date, date_now,start_date <= date_now,newObj,index,monthly_dues)
            }

            start_date.setMonth(start_date.getMonth() + 1);
            number_months++;
            compounding_dues = compounding_dues - amount_paid_current_month;

        }
    }

    return NextResponse.json(arr_obj)

    if (!payment)
        return NextResponse.json({
            error: 'payment not found',
        },
            {
                status: 404
            });

    return NextResponse.json(payment)
}