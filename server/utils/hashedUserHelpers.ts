import prisma from '@/prisma';
import { User } from '@prisma/client';
import { createHash } from 'crypto';

export function hashEmail(email: string): string {
  return createHash('sha256').update(email).digest('hex');
}

export async function findHashedUser(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email: hashEmail(email) } });
}
