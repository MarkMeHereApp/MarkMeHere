import { publicProcedure, router } from '../trpc';
import { User } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';

export const zUpdateSelectedCourseId = z.object({
  email: z.string(),
  newCourseId: z.string()
});

export const userRouter = router({
  // This procedure should update the selectedCourseId of the user with the given email...
  // When auth is completed by Nick.
  updateSelectedCourseId: publicProcedure
    .input(zUpdateSelectedCourseId)
    .mutation(async (requestData) => {
      // Update the selectedCourseId of the user with the given email
      const updatedUsers = await prisma.user.update({
        where: { email: requestData.input.email },
        data: { selectedCourseId: requestData.input.newCourseId }
      });
      return { success: true };
    })
});

export type UserRouter = typeof userRouter;
