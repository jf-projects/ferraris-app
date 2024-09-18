import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";
import { logAction } from "@/app/util/logger";
import bcrypt from 'bcrypt';

export async function GET(request: NextRequest,
    { params }: { params: { id: string } }) {
    const client = await prisma.user.findUnique({
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

    const user = await prisma.user.findUnique({
        where: { id: parseInt(params.id) }
    });

    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 })

    if (!user)
        return NextResponse.json({ error: 'user not found' }, { status: 400 })


    const user_email = await prisma.user.findUnique({
        where: {
            email: body.email,
            NOT: {
                id: body.id, // Exclude the user with this specific ID
            },
        },
    });

    let hashedPassword;
    if(body.password){
        hashedPassword = await bcrypt.hash(body.password, 10);
    }

    if(user_email)
        return NextResponse.json({error: 'user email exist'}, { status: 400 })

    const updated_user = await prisma.user.update({
        where: { id: user.id },
        data: {
            name: body.name,
            email: body.email,
            type: body.type,
            ...(body.password && { password: hashedPassword }) 
        }
    })

    await logAction({
        entity: 'User',
        action: 'update',
        oldValue: user,
        newValue: updated_user,
        model_id: user.id
    });

    return NextResponse.json(updated_user, { status: 200 })
}


export async function DELETE(request: NextRequest,
    { params }: { params: { id: string } }) {


    const data = {
        deletedAt: new Date(),
    };

    const client = await prisma.user.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!client)
        return NextResponse.json({ error: 'Client not found' })


    try {
        const deleted_client = await prisma.user.update({
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