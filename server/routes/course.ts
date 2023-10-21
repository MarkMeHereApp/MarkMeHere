/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import { CourseMember } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';
import { zCourseRoles } from '@/types/sharedZodTypes';
import { zLMSProvider } from '@/types/sharedZodTypes';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';

export const zCreateCourseRequest = z.object({
  newCourseData: z.object({
    courseCode: z.string(),
    name: z.string(),
    lmsId: z.string().optional(),
    lmsType: zLMSProvider
  }),

  autoEnroll: z.boolean().optional().default(false),

  newMemberData: z
    .object({
      email: z.string(),
      name: z.string(),
      role: zCourseRoles,
      lmsId: z.string().nullable().optional()
    })
    .optional()
});
export type zCreateCourseRequestType = z.infer<typeof zCreateCourseRequest>;

export const courseRouter = router({
  /*
  We will protect this using nextMiddleware (Only faculty and admin users
  have permission to create courses)
  */
  createCourse: publicProcedure
    .input(zCreateCourseRequest)

    .mutation(async (requestData) => {
      try {
        const resCourse = await prisma.course.create({
          data: {
            ...requestData.input.newCourseData
          }
        });
        let resEnrollment: CourseMember | null = null;
        // Check if enrollment flag is true
        if (requestData.input.autoEnroll) {
          if (requestData.input.newMemberData === undefined) {
            throw generateTypedError(
              new TRPCError({
                code: 'BAD_REQUEST',
                message: 'autoEnroll flag is true but no newMemberData provided'
              })
            );
          }

          try {
            // Create a new enrollment record for the user
            resEnrollment = await prisma.courseMember.create({
              data: {
                courseId: resCourse.id,
                ...requestData.input.newMemberData
              }
            });
          } catch (error) {
            throw generateTypedError(
              error as Error,
              'Created course but failed to enroll user'
            );
          }
        }

        return { success: true, resCourse, resEnrollment };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  getAllCourses: publicProcedure.query(async () => {
    try {
      const courses = await prisma.course.findMany({});
      return { success: true, courses };
    } catch (error) {
      throw generateTypedError(error as Error);
    }
  })
});

export type CourseRouter = typeof courseRouter;
