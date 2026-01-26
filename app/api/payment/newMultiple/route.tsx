import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import paymentSchema from '../schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const start = new Date(body.paymentDate);
        const end = new Date(body.paymentEndDate);

        if (start > end) {
            return NextResponse.json(
                { message: "Start date must be earlier than end date" },
                { status: 400 }
            );
        }

        const payments: any[] = [];
        const current = new Date(start);
        const startDay = current.getDate();

        while (current <= end) {
            payments.push({
                lotTransactionId: Number(body.lotTransactionId),
                amount: body.amount ? Number(body.amount) : null,
                bank: body.bank ?? null,
                paymentDate: new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    Math.min(startDay, 28)
                ),
                remarks: body.remarks ?? null,
            });

            current.setMonth(current.getMonth() + 1);
        }

        const result = await prisma.payment.createMany({
            data: payments,
            skipDuplicates: true,
        });

        return NextResponse.json(
            {
                message: "Payments created successfully",
                count: result.count,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

