import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let year = searchParams.get('year') ? searchParams.get('year') : 2024;

    // Fetch all payments from the year 2024 where deletedAt is null
    const payments = await prisma.payment.findMany({
        where: {
            deletedAt: null, // Only include non-deleted payments
            paymentDate: {
                gte: new Date(`${year}-01-01`), // From January 1, 2024
                lte: new Date(`${year}-12-31`), // To December 31, 2024
            },
        }
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Helper to get the month index from paymentDate
    const getMonthIndex = (date: Date  | null): number | null => {
        if (!date) return null;
        return new Date(date).getMonth(); // Returns month as a number (0-11)
    };

    // Group and sum amounts by month
    const monthlySums = new Array(12).fill(0); // Initialize array with 12 zeros
    payments.forEach(payment => {
        const monthIndex = getMonthIndex(payment.paymentDate);
        if (monthIndex !== null) {
            monthlySums[monthIndex] += payment.amount ? payment.amount.toNumber() : 0;
        }
    }
    );

    // // Combine month names with sums
    // const result = monthNames.map((month, index) => ({
    //     x: index,
    //     label: month,
    //     y: monthlySums[index] || 0
    // }));

    return NextResponse.json(monthlySums, { status: 200 });
};
