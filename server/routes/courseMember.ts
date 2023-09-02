import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zNewCourseMember = z.object({
  // The input schema goes here
  newMemberData: z.object({
    id: z.string(),
    lmsId: z.string().nullable(),
    email: z.string(),
    name: z.string(),
    courseId: z.string(),
    dateEnrolled: z.date(),
    role: z.string()
  })
});

export const zGetCourseMembersOfCourse = z.object({
  courseId: z.string()
});

export const courseMemberRouter = router({
  createCourseMember: publicProcedure
    .input(zNewCourseMember)
    .mutation(async (requestData) => {
      try {
        const resEnrollment = await prisma.courseMember.create({
          data: {
            ...requestData.input.newMemberData
          }
        });
        return { success: true, resEnrollment };
      } catch (error) {
        console.error(error);
        return { success: false };
      }
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
