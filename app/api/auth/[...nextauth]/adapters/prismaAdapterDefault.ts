/*
Default Prisma database adapter
*/
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { AdapterUser } from 'next-auth/adapters';

export default function prismaAdapterDefault(prisma: PrismaClient) {
    return {
      ...PrismaAdapter(prisma),
      createUser: (data: Omit<AdapterUser, 'id'>) => {
        const role = 'FACULTY';
        return prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            role: role,
            image: data.image,
          }
        });
      }
    };
  }