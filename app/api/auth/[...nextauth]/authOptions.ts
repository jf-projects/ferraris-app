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

                return passwordMatch ? user : null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // This points to your custom sign-in page
    },
    session: {
        strategy: 'jwt', // Use JWT for sessions
        maxAge: 24 * 60 * 60, // 1 day in seconds
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Add id to the JWT token
                token.type = user.type; // Add type to the JWT token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as number; // Add id to the session
                session.user.type = token.type as string; // Add type to the session
            }
            return session;
        }
    }

}