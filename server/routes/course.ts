import { publicProcedure, router } from '../trpc';
import { CourseMember } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';
import { zLMSProvider } from '@/types/sharedZodTypes';

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
      role: z.string(),
      lmsId: z.string().nullable().optional()
    })
    .optional()
});

export const courseRouter = router({
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
            throw new Error(
              'Error: autoEnroll flag is true but no newMemberData was provided'
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
            throw new Error('Error: Created course but failed to enroll user');
          }
        }

        return { success: true, resCourse, resEnrollment };
      } catch (error) {
        throw new Error('Error creating course');
      }
    })
});

export type CourseRouter = typeof courseRouter;
