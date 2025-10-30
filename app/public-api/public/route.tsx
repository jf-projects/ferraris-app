import { NextRequest, NextResponse } from 'next/server';
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
                },
                select: {
                    firstName: true,
                },
            }
        );

        return NextResponse.json(clients);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating client' }, { status: 500 });

    }
}
