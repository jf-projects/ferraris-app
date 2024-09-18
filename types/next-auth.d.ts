// next-auth.d.ts

import NextAuth from 'next-auth';
import { User as UserModel } from '@prisma/client';

declare module 'next-auth' {
  interface User extends UserModel {
    id: number; // Extend User with id
  }

  interface Session {
    user: {
      id: number; // Ensure id is included in the session
      name?: string | null;
      email?: string | null;
    } & DefaultSession['user'];
  }
}
