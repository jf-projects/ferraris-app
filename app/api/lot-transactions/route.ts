import { NextRequest, NextResponse } from 'next/server';
import lotTransactionSchema from './schema'; // Adjust path as needed
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET() {
    try {
        const lot_transactions = await prisma.lotTransaction.findMany(
            {
                where: {
                    deletedAt: null, // Include only lot_transactions where deleted_at is null
                },
                orderBy: {
                    id: 'desc', // 'desc' for descending order
                },
                include: {
                    client: true, // Include the related client for each lot transaction
                },
            }
        );

        const updatedTransactions = lot_transactions.map(transaction => {
            if (transaction.client && transaction.client.deletedAt !== null) {
                return {
                    ...transaction,
                    client: null,
                };
            }
            return transaction;
        });

        return NextResponse.json(updatedTransactions);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching transactions' }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = lotTransactionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }
        const newClient = await prisma.lotTransaction.create({
            data: {
                clientId: body.clientId || null, // Nullable integer
                propertyUnit: body.propertyUnit || null, // Nullable string with max length 255
                totalPropertySize: body.totalPropertySize || null, // Nullable integer
                type: body.type || null, // Nullable string with max length 255
                unitBlock: body.unitBlock || null, // Nullable string with max length 255
                unitLot: body.unitLot || null, // Nullable string with max length 255
                propertyUnitAddress: body.propertyUnitAddress || null, // Nullable string with max length 255
                propertyTotalAmount: body.propertyTotalAmount || null, // Nullable string with max length 255
                downpayment: body.downpayment || null, // Nullable integer
                paymentTerms: body.paymentTerms || null, // Nullable string with max length 255
                incrementValues: body.incrementValues || null, // Nullable text
                dueDate: body.dueDate ? new Date(body.dueDate) : null, // Nullable integer
                interest: body.interest || null, // Nullable float
                sqm: body.sqm || null, // Nullable float
                incrementAmount: body.incrementAmount || null, // Nullable float
                transactionDate: body.transactionDate ? new Date(body.transactionDate) : null, // Nullable date string transformed to Date object
                autocompute: body.autocompute, // Required integer
                deletedAt: body.deletedAt ? new Date(body.deletedAt) : null, // Nullable date string transformed to Date object
            }
        });

        return NextResponse.json(newClient, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
