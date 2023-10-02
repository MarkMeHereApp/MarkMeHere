/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';

export const zCreateUser = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string()
});

export const userRouter = router({
  /*
  Admins have permssion to create any type of user account
  */
  createUser: publicProcedure
    .input(zCreateUser)
    .mutation(async (requestData) => {
      try {
        const { name, email, role } = requestData.input;

        await prisma.user.create({
          data: {
            name,
            email,
            role
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type UserRouter = typeof userRouter;
