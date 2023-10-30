import prisma from '@/prisma';
import { User } from '@prisma/client';

export async function findDefaultUser(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email: email } });
}
