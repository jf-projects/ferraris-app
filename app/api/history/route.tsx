import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client'; // Adjust path as needed

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');
    const item_id = searchParams.get('itemID');

    // Convert item_id to a number or null
    const itemIdNumber = item_id ? parseInt(item_id, 10) : null;
    const modelString = model ? model : 'Client';
    console.log(itemIdNumber,modelString)
    try {
        const payments = await prisma.log.findMany({
            where: {
                entity: {
                    contains: modelString,
                    mode: 'insensitive' 
                }, 
                model_id: itemIdNumber, // `itemIdNumber` should be a number or null
            },
            orderBy: {
                id: 'desc', // 'desc' for descending order
            },
            include: {
                user: true, // Includes the related `user` data
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating payment' }, { status: 500 });
    }
}
