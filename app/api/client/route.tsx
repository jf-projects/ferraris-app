import { NextRequest, NextResponse } from 'next/server';
import clientSchema from './schema'; // Adjust path as needed
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET() {
    try {
        const clients = await prisma.client.findMany(
            {
                where: {
                    deletedAt: null, // Include only clients where deleted_at is null
                },
                orderBy: {
                    id: 'desc', // 'desc' for descending order
                }
            }
        );

        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating client' }, { status: 500 });

    }
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = clientSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }
        const newClient = await prisma.client.create({
            data: {
                firstName: body.firstName,
                middleName: body.middleName,
                lastName: body.lastName,
                address: body.address,
                gender: body.gender,
                civilStatus: body.civilStatus,
                clientNumber: body.clientNumber,
                spouseFirstName: body.spouseFirstName,
                spouseMiddleName: body.spouseMiddleName,
                spouseLastName: body.spouseLastName,
                bday: body.bday ? new Date(body.bday) : null,
                image: body.image,
                client_id: body.client_id,
                email: body.email,
            }
        });

        return NextResponse.json(newClient, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
