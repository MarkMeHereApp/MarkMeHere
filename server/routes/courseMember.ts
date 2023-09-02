import { publicProcedure, router } from '../trpc';
import { User } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';

export const zRequestExample = z.object({
  // The input schema goes here
});

export const courseMemberRouter = router({
  createCourseMember: publicProcedure
    .input(zRequestExample)
    .mutation(async (requestData) => {
      // The logic for this procedure goes here
      return { success: true };
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
