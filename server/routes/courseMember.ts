import { publicProcedure, router } from '../trpc';
import { CourseMember } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';

export const zRequestExample = z.object({
  // The input schema goes here
});
export const zGetCourseMembersOfCourse = z.object({
  courseId: z.string()
});

export const courseMemberRouter = router({
  createCourseMember: publicProcedure
    .input(zRequestExample)
    .mutation(async (requestData) => {
      // The logic for this procedure goes here
      return { success: true };
    }),

  getCourseMembersOfCourse: publicProcedure
    .input(zGetCourseMembersOfCourse)
    .query(async (requestData) => {
      try {
        const courseMembers = await prisma.courseMember.findMany({
          where: {
            courseId: requestData.input.courseId
          }
        });
        return courseMembers;
      } catch (error) {
        throw new Error('Error getting course members');
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
