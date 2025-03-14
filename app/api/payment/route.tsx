import { NextRequest, NextResponse } from 'next/server';
import paymentSchema from './schema'; // Adjust path as needed
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET() {
    try {
        const payments = await prisma.payment.findMany(
            {
                where: {
                    deletedAt: null, // Include only payments where deleted_at is null
                },
                orderBy: {
                    id: 'desc', // 'desc' for descending order
                },
                include: {
                    transaction: {
                        include: {
                            client: true, // Include client details from the transaction
                        }
                    }
                },
            }
        );

        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating payment' }, { status: 500 });

    }
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }
        const newClient = await prisma.payment.create({
            data: {
                lotTransactionId: body.lotTransactionId, // Assuming foreign key is passed as `lotTransactionId`
                amount: body.amount ? parseFloat(body.amount) : null, // Parse amount as a float, or null if not provided
                bank: body.bank, // Nullable string field for bank
                paymentDate: body.paymentDate ? new Date(body.paymentDate) : null, // Convert string to Date, or null
                remarks: body.remarks, // Nullable string field for remarks
            }
        });

        return NextResponse.json(newClient, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
