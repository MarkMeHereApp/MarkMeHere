import prisma from '@/prisma';
//import { User } from '@prisma/client';
import { createHash } from 'crypto';
import { User } from 'next-auth/core/types';

export async function createDefaultUser(user: User): Promise<User | null> {
  return await prisma.user.create({ data: user });
}

export async function findUser(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email: email } });
}

export function hashEmail(email: string): string {
  return createHash('sha256').update(email).digest('hex');
}
