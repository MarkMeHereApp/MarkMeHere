/* -------- Any site role can access these routes however only a user with 
a course role of teacher can access them -------- */

import { router } from '../trpc';
import { CourseMember } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';
import { zCourseRoles } from '@/types/sharedZodTypes';
import { zLMSProvider } from '@/types/sharedZodTypes';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import adminProcedure from '../middleware/adminProcedure';

export const zCreateCourseRequest = z.object({
  newCourseData: z.object({
    courseCode: z.string(),
    organizationCode: z.string(),
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

export const zDeleteCourseRequest = z.object({
  courseId: z.string()
});
export type zDeleteCourseRequestType = z.infer<typeof zDeleteCourseRequest>;

export const courseRouter = router({
  /*
  We will protect this using nextMiddleware (Only faculty and admin users
  have permission to create courses)
  */
  createCourse: adminProcedure
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

  deleteCourse: adminProcedure
    .input(zDeleteCourseRequest)
    .mutation(async (requestData) => {
      try {
        const resCourse = await prisma.course.delete({
          where: {
            id: requestData.input.courseId
          }
        });

        if (!resCourse) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Course not found'
            })
          );
        }

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseRouter = typeof courseRouter;
