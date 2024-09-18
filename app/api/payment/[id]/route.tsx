import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";
import { logAction } from "@/app/util/logger";

export async function GET(request: NextRequest,
    { params }: { params: { id: string } }) {
    const payment = await prisma.payment.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!payment)
        return NextResponse.json({
            error: 'payment not found',
        },
            {
                status: 404
            });

    return NextResponse.json(payment)
}

export async function PUT(request: NextRequest,
    { params }: { params: { id: string } }) {
    const body = await request.json();
    const validation = schema.safeParse(body)

    const payment = await prisma.payment.findUnique({
        where: { id: parseInt(params.id) }
    });

    // Debugging statements
    // console.log('Received body:', body);
    // console.log('Validation result:', validation);

    if (!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400})

    if (!payment)
        return NextResponse.json({ error: 'payment not found' }, {status: 400})


    // Debugging statements
    // console.log('Existing payment:', payment);
    // const updated_payment = await prisma.payment.update({
    //     where: { id: payment.id },
    //     data: {
    //         lotTransactionId: body.lotTransactionId,
    //         amount: body.amount,
    //         bank: body.bank,
    //         paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
    //         remarks: body.remarks || null,
    //     }
    // })

    const updated_payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
            ...body,
            paymentDate: body.paymentDate && new Date(body.paymentDate),
        },
    });

    await logAction({
        entity: 'Payment',
        action: 'update',
        oldValue: payment,
        newValue: updated_payment,
        model_id: payment.id
    });

    return NextResponse.json(updated_payment, {status: 200})
}


export async function DELETE(request: NextRequest,
    { params }: { params: { id: string } }) {


    const data = {
        deletedAt: new Date(),
    };

    const payment = await prisma.payment.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!payment)
        return NextResponse.json({ error: 'payment not found' })


    try {
        const deleted_payment = await prisma.payment.update({
            where: { id: payment.id },
            data: data
        })

        await logAction({
            entity: 'Payment',
            action: 'delete',
            oldValue: payment,
            newValue: deleted_payment,
            model_id: payment.id
        });


        return NextResponse.json(
            {
                message: deleted_payment
            }
        )
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}