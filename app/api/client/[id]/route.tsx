import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";
import { logAction } from "@/app/util/logger";

export async function GET(request: NextRequest,
    { params }: { params: { id: string } }) {
    const client = await prisma.client.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!client)
        return NextResponse.json({
            error: 'client not found',
        },
            {
                status: 404
            });

    return NextResponse.json(client)
}

export async function PUT(request: NextRequest,
    { params }: { params: { id: string } }) {
    const body = await request.json();
    const validation = schema.safeParse(body)

    const client = await prisma.client.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!validation.success)
        return NextResponse.json(validation.error.errors, {status: 400})

    if (!client)
        return NextResponse.json({ error: 'client not found' }, {status: 400})


    const updated_client = await prisma.client.update({
        where: { id: client.id },
        data: {
            ...body,
            bday: body.bday ? new Date(body.bday) : null, // Correct conditional handling
        },
    });

    await logAction({
        entity: 'Client',
        action: 'update',
        oldValue: client,
        newValue: updated_client,
        model_id: client.id
    });

    return NextResponse.json(updated_client, { status: 200 })
}


export async function DELETE(request: NextRequest,
    { params }: { params: { id: string } }) {


    const data = {
        deletedAt: new Date(),
    };

    const client = await prisma.client.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!client)
        return NextResponse.json({ error: 'Client not found' })


    try {
        const deleted_client = await prisma.client.update({
            where: { id: client.id },
            data: data
        })

        await logAction({
            entity: 'Client',
            action: 'delete',
            oldValue: client,
            newValue: deleted_client,
            model_id: client.id
        });


        return NextResponse.json(
            {
                message: deleted_client
            }
        )
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}