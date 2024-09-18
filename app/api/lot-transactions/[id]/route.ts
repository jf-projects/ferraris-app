import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";
import { logAction } from "@/app/util/logger";

export async function GET(request: NextRequest,
    { params }: { params: { id: string } }) {
    const lotTransaction = await prisma.lotTransaction.findUnique({
        where: {
            id: parseInt(params.id),
            deletedAt: null, // Include only lot_transactions where deleted_at is null
        },
        include: {
            client: true, // Include the related client for each lot transaction
        },
    });

    // Filter out the client if client.deletedAt is not null
    if (lotTransaction && lotTransaction.client && lotTransaction.client.deletedAt !== null) {
        lotTransaction.client = null; // or you could omit the `client` property entirely
    }

    if (!lotTransaction)
        return NextResponse.json({
            error: 'Transaction not found',
        },
            {
                status: 404
            });

    return NextResponse.json(lotTransaction)
}

export async function PUT(request: NextRequest,
    { params }: { params: { id: string } }) {
    const body = await request.json();
    delete body.client;
    const validation = schema.safeParse(body)

    const lot_transaction = await prisma.lotTransaction.findUnique({
        where: { id: parseInt(params.id) }
    });

    
    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 })

    if (!lot_transaction)
        return NextResponse.json({ error: 'Transactions not found' }, { status: 400 })

    try {
        // const updated_transaction = await prisma.lotTransaction.update({
        //     where: { id: lot_transaction.id },
        //     data: {
        //         clientId: body.clientId,
        //         propertyUnit: body.propertyUnit,
        //         totalPropertySize: body.totalPropertySize,
        //         type: body.type,
        //         unitBlock: body.unitBlock,
        //         unitLot: body.unitLot,
        //         propertyUnitAddress: body.propertyUnitAddress,
        //         propertyTotalAmount: body.propertyTotalAmount,
        //         downpayment: body.downpayment,
        //         paymentTerms: body.paymentTerms,
        //         incrementValues: body.incrementValues,
        //         dueDate: new Date(body.dueDate),
        //         interest: body.interest,
        //         sqm: body.sqm,
        //         incrementAmount: body.incrementAmount,
        //         transactionDate: new Date(body.transactionDate),
        //         autocompute: body.autocompute,
        //         deletedAt: new Date(body.deletedAt),
        //         interestDate: new Date(body.interestDate),
        //     }
        // })
        // return NextResponse.json({
        //     ...body,
        //     dueDate: body.dueDate && new Date(body.dueDate),
        //     transactionDate: body.transactionDate && new Date(body.transactionDate),
        //     deletedAt: body.deletedAt && new Date(body.deletedAt),
        //     interestDate: body.interestDate && new Date(body.interestDate),
        // }, { status: 200 })
        const updated_transaction = await prisma.lotTransaction.update({
            where: { id: lot_transaction.id },
            data: {
                ...body,
                dueDate: body.dueDate && new Date(body.dueDate),
                transactionDate: body.transactionDate && new Date(body.transactionDate),
                deletedAt: body.deletedAt && new Date(body.deletedAt),
                interestDate: body.interestDate && new Date(body.interestDate),
            },
        });
        
        
        await logAction({
            entity: 'LotTransaction',
            action: 'update',
            oldValue: lot_transaction,
            newValue: updated_transaction,
            model_id: lot_transaction.id
        });

        return NextResponse.json({
            ...body,
            dueDate: body.dueDate && new Date(body.dueDate),
            transactionDate: body.transactionDate && new Date(body.transactionDate),
            deletedAt: body.deletedAt && new Date(body.deletedAt),
            interestDate: body.interestDate && new Date(body.interestDate),
        }, { status: 200 })
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest,
    { params }: { params: { id: string } }) {


    const data = {
        deletedAt: new Date(),
    };

    const lot_transaction = await prisma.lotTransaction.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!lot_transaction)
        return NextResponse.json({ error: 'Client not found' })


    try {
        const deleted_lot_transaction = await prisma.lotTransaction.update({
            where: { id: lot_transaction.id },
            data: data
        })

        await logAction({
            entity: 'LotTransaction',
            action: 'delete',
            oldValue: lot_transaction,
            newValue: deleted_lot_transaction,
            model_id: lot_transaction.id
        });


        return NextResponse.json(
            {
                message: 'data deleted',
                data: deleted_lot_transaction
            }
        )
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}