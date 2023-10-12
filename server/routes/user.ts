/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { zSiteRoles } from '@/types/sharedZodTypes';
export const zCreateUser = z.object({
  name: z.string(),
  email: z.string(),
  role: zSiteRoles
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

        zSiteRoles.parse(role);

        if (!name || !email || !role) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Missing required fields'
            })
          );
        }

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
