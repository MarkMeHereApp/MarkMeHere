import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';

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
      try {
        const updatedUsers = await prisma.user.update({
          where: { email: requestData.input.email },
          data: { selectedCourseId: requestData.input.newCourseId }
        });
        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type UserRouter = typeof userRouter;
