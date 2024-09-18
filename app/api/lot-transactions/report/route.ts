import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let year = searchParams.get('year') ? searchParams.get('year') : 2024;

    try {

        const lot_transactions = await prisma.lotTransaction.findMany({
            where: {
                deletedAt: null, // Include only lot_transactions where deletedAt is null
                transactionDate: {
                    gte: new Date(`${year}-01-01`), // From January 1, 2024
                    lte: new Date(`${year}-12-31`), // To December 31, 2024
                },
            },
            orderBy: {
                id: 'desc', // 'desc' for descending order
            }
        });

        // Process transactions to count per month
        const transactionsPerMonth = Array(12).fill(0); // Create an array with 12 months, initialized to 0

        lot_transactions.forEach(transaction => {
            if (transaction.transactionDate) { // Ch
                const month = new Date(transaction.transactionDate).getMonth(); // Get month (0-11)
                transactionsPerMonth[month] += 1; // Increment the count for the corresponding month
            }
        });
        return NextResponse.json(transactionsPerMonth);


    } catch (error) {
        return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
    }
}
