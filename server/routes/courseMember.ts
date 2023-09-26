
/* -------- Only Professors or TA's can access most of these routes -------- */
/* -------- Students can access the getCourseMembersOfCourse route -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';

import { z } from 'zod';

export const zCourseMember = z.object({
  id: z.string(),
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
            ...requestData.input,
            id: requestData.input.id || undefined
          }
        });
        return { success: true, resEnrollment };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  deleteCourseMembers: publicProcedure
    .input(z.array(zCourseMember))
    .mutation(async (requestData) => {
      try {
        // Extract valid course member IDs from the input array
        const memberIdsToDelete = requestData.input.map((member) => member.id);

        // Check if there are valid IDs to delete
        if (memberIdsToDelete.length === 0) {
          throw new Error('No valid course member IDs provided');
        }

        // Delete course members by their IDs
        await prisma.courseMember.deleteMany({
          where: {
            id: {
              in: memberIdsToDelete
            }
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
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
      throw generateTypedError(error as Error);
    }
  }),

  //This route should be able to be accessed by students as well
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
        throw generateTypedError(error as Error);
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
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
