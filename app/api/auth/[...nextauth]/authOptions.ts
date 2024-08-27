import prisma from "@/prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "admin@admin.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);

                if (!passwordMatch) return null;

                // Convert the id to a string to match the expected User type in NextAuth
                return {
                    id: user.id.toString(),  // Convert id to string
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // This points to your custom sign-in page
    },
    // callbacks: {
    //     async redirect({ url, baseUrl }) {
    //         return baseUrl; // Always redirect to home page
    //     },
    // },

}