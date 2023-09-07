import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

import { z } from 'zod';

export const zCourseMember = z.object({
  id: z.string().optional(),
  lmsId: z.string().nullable(),
  email: z.string(),
  name: z.string(),
  courseId: z.string(),
  dateEnrolled: z.date(),
  role: z.string()
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
    .input(zCourseMember)
    .mutation(async (requestData) => {
      try {
        const resEnrollment = await prisma.courseMember.create({
          data: {
            ...requestData.input
          }
        });
        return { success: true, resEnrollment };
      } catch (error) {
        console.error(error);
        return { success: false };
      }
    }),

  deleteCourseMember: publicProcedure
    .input(zCourseMember)
    .mutation(async (requestData) => {
      try {
        await prisma.courseMember.delete({
          where: {
            id: requestData.input.id
          }
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false };
      }
    }),

  deleteAllStudents: publicProcedure.mutation(async (requestData) => {
    try {
      await prisma.courseMember.deleteMany({
        where: {
          role: 'student'
        }
      });
      return { success: true };
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
          },
          orderBy: {
            name: 'asc'
          }
        });
        return { success: true, courseMembers };
      } catch (error) {
        throw new Error('Error getting course members');
      }
    }),

  // TODO: If there is duplicate data, overwrite the existing data.
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
