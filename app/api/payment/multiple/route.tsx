import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed
import paymentSchema from '../schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = paymentSchema.array().safeParse(body);

        const payments = await prisma.payment.findMany({
            where: {
                lotTransactionId: parseInt(body[0].lotTransactionId),
                deletedAt: null // Filter for records where deletedAt is null
            },
            orderBy: { id: 'desc' },
        });

        if (payments.length > 0) {
            return NextResponse.json(
                {
                    'message': 'There are existing Payments for this Transaction',
                    'status': 'failed'
                },
                { status: 400 });
        }


        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }

        // Prepare data for bulk creation
        const paymentData = body.map((payment: { lotTransactionId: any; amount: string; bank: any; paymentDate: string | number | Date; remarks: any; }) => ({
            lotTransactionId: payment.lotTransactionId, // Assuming foreign key is passed as `lotTransactionId`
            amount: payment.amount ? parseFloat(payment.amount) : null, // Parse amount as a float, or null if not provided
            bank: payment.bank, // Nullable string field for bank
            paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : null, // Convert string to Date, or null
            remarks: payment.remarks, // Nullable string field for remarks
        }));

        // Create multiple payments in a single operation
        const newPayments = await prisma.payment.createMany({
            data: paymentData,
            skipDuplicates: true, // Optional: Skip duplicate records if primary keys or unique constraints are violated
        });

        // return NextResponse.json(newPayments, { status: 200 });

        return NextResponse.json(
            {
                'count': newPayments,
                'message': 'Successful in adding payments',
                'status': 'ok'
            },
            { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}