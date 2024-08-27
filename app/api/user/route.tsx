import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";
import bcrypt from 'bcrypt';


export async function GET() {
   const users = await prisma.user.findMany();
   return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body)

    if (!validation.success)
        return NextResponse.json(validation.error.errors)

    const user = await prisma.user.findUnique({
        where: {email: body.email}
    });

    const hashedPassword = await bcrypt.hash(body.password, 10);

    if(user)
        return NextResponse.json({error: 'user already exist'})

    const new_user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hashedPassword,
        }
    })


    return NextResponse.json(new_user, {status: 201});
}