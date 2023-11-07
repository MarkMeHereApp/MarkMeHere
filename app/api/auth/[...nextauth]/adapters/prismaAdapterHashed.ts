/*
Prisma database adapter designed to handle email hashing
*/
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { AdapterUser } from 'next-auth/adapters';
import bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { hashEmail } from '@/server/utils/userHelpers';

export default function prismaAdapterHashed(prisma: PrismaClient) {
  return {
    ...PrismaAdapter(prisma),
    createUser: async (data: Omit<AdapterUser, 'id'>) => {
      const role = zSiteRoles.Enum.user;
      const hashedEmail = hashEmail(data.email)
      return prisma.user.create({
        data: {
          name: data.name,
          email: hashedEmail,
          role: role,
          image: data.image
        }
      });
    },

    getUserByEmail: async (email: string) => {
      // const allUsers = await prisma.user.findMany();

      // for (const user of allUsers) {
      //   const isEmailMatch = await bcrypt.compare(email, user.email ?? '');
      //   if (isEmailMatch) {
      //     return user;
      //   }
      // }

      const hashedEmail = hashEmail(email)
      console.log(hashedEmail)
      return await prisma.user.findUnique({ where: { email: hashedEmail } });
    }
  };
}
