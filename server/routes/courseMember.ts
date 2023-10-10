/* -------- Only Professors or TA's can access these routes -------- */

import {
  elevatedCourseMemberCourseProcedure,
  publicProcedure,
  router
} from '../trpc';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { conforms } from 'lodash';

import { z } from 'zod';

export const zCourseMember = z.object({
  id: z.string(),
  lmsId: z.string().nullable(),
  email: z.string(),
  name: z.string(),
  courseId: z.string(),
  dateEnrolled: z.date(),
  role: z.string(),
  optionalId: z.string()
});

export const zGetCourseMembersOfCourse = z.object({
  courseId: z.string()
});

export const zGetCourseMemberOfCourse = z.object({
  courseId: z.string(),
  email: z.string()
});

export const zGetCourseMemberRole = z.object({
  courseId: z.string()
});
export const zCreateMultipleCourseMembers = z.object({
  courseId: z.string(),
  courseMembers: z.array(
    z.object({
      optionalId: z.string().optional(),
      name: z.string(),
      email: z.string(),
      role: z.string()
    })
  )
});

export const courseMemberRouter = router({
  createCourseMember: elevatedCourseMemberCourseProcedure
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

  deleteCourseMembers: elevatedCourseMemberCourseProcedure
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

  deleteAllStudents: elevatedCourseMemberCourseProcedure.mutation(
    async (requestData) => {
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
    }
  ),
  getCourseMemberOfCourse: elevatedCourseMemberCourseProcedure
    .input(zGetCourseMemberOfCourse)
    .query(async (requestData) => {
      try {
        const courseMember = await prisma.courseMember.findFirst({
          where: {
            courseId: requestData.input.courseId,
            email: requestData.input.email
          }
        });
        return { success: true, courseMember };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  getCourseMembersOfCourse: elevatedCourseMemberCourseProcedure
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

  getCourseMemberRole: publicProcedure
    .input(zGetCourseMemberRole)
    .query(async (requestData) => {
      try {
        const email = requestData.ctx?.session?.email;
        if (!email)
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'user does not have a session'
            })
          );
        //Find the role of the current course member
        const role = await prisma.courseMember.findFirst({
          where: {
            courseId: requestData.input.courseId,
            email: email
          },
          select: {
            role: true
          }
        });
        return { success: true, role: role?.role };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  // TODO: If there is duplicate data, overwrite the existing data.
  createMultipleCourseMembers: publicProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        const upsertedCourseMembers = [];
        for (const memberData of requestData.input.courseMembers) {
          if (memberData.role === 'student') {
            if (
              memberData.optionalId !== null &&
              memberData.optionalId !== undefined
            ) {
              const existingMember = await prisma.courseMember.findFirst({
                where: {
                  courseId: requestData.input.courseId,
                  optionalId: memberData.optionalId
                }
              });

              if (existingMember) {
                // If the member exists and optionalId is not null, update it
                const updatedMember = await prisma.courseMember.update({
                  where: { id: existingMember.id },
                  data: memberData
                });
                upsertedCourseMembers.push(updatedMember);
              } else {
                // If the member doesn't exist and optionalId is not null, create it
                const createdMember = await prisma.courseMember.create({
                  data: {
                    ...memberData,
                    courseId: requestData.input.courseId
                  }
                });
                upsertedCourseMembers.push(createdMember);
              }
            } else {
              // If optionalId is null or undefined, treat it as a new member (first-time import)
              const createdMember = await prisma.courseMember.create({
                data: {
                  ...memberData,
                  courseId: requestData.input.courseId
                }
              });

              upsertedCourseMembers.push(createdMember);
            }
          }
        }

        // Fetch all course members after the upsert operation
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
