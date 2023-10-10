/*
Default Prisma database adapter
*/
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';

export default function prismaAdapterDefault(prisma: PrismaClient) {
    return {
      ...PrismaAdapter(prisma),
      createUser: (data: any) => {
        const role = 'FACULTY';
        return prisma.user.create({ data: { ...data, role: role } });
      }
    };
  }