import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

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
export const zCreateMultipleCourseMembers = z.object({
  courseId: z.string(),
  courseMembers: z.array(
    z.object({
      lmsId: z.string().optional(),
      name: z.string(),
      email: z.string(),
      role: z.string()
    })
  )
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
        return { success: true, courseMembers };
      } catch (error) {
        throw new Error('Error getting course members');
      }
    }),
  createMultipleCourseMembers: publicProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        await prisma.courseMember.createMany({
          data: requestData.input.courseMembers.map((member) => ({
            ...member,
            courseId: requestData.input.courseId
          }))
        });
        const allCourseMembersOfClass = await prisma.courseMember.findMany({
          where: {
            courseId: requestData.input.courseId
          }
        });
        return { success: true, allCourseMembersOfClass };
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new Error(
            'Unique constraint error: A course member with the same email already exists'
          );
        } else {
          throw new Error('Error creating course members');
        }
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
