import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed

export async function POST(request: NextRequest) {
    const body = await request.json();
    const startDate = body.start_date; // Replace with your start date
    const endDate = body.end_date;   // Replace with your end date

    try {
        const payments = await prisma.payment.findMany({
            where: {
                deletedAt: null, // Include only payments where deleted_at is null
                paymentDate: {
                    gte: startDate, // Greater than or equal to startDate
                    lte: endDate    // Less than or equal to endDate
                },
            },
            orderBy: {
                id: 'desc', // 'desc' for descending order
            },
            select: {
                id: true,
                amount: true,
                paymentDate: true,
                transaction: {
                    select: {
                        id: true,
                        propertyUnit: true,
                        client: {
                            select: {
                                id: true,
                                firstName: true, // Adjust field names based on your Client model
                                lastName: true, // Adjust field names based on your Client model
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}