/* -------- Only Professors or TA's can access these routes -------- */

import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';
import { publicProcedure, router } from '../trpc';
import {
  createCourseMember,
  findCourseMember,
  updateCourseMember
} from '../utils/courseMemberHelpers';
import { hashEmail } from '../utils/userHelpers';
import elevatedCourseMemberCourseProcedure from '../middleware/elevatedCourseMemberCourseProcedure';
import courseMemberProcedure from '../middleware/courseMemberProcedure';
export const zCourseMember = z.object({
  lmsId: z.string().optional(),
  email: z.string(),
  name: z.string(),
  courseId: z.string(),
  role: zCourseRoles,
  optionalId: z.string().optional()
});

export const zGetCourseMembersOfCourse = z.object({
  courseId: z.string()
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
      role: zCourseRoles
    })
  )
});

export const zDeleteCourseMembersFromCourse = z.object({
  courseMemberIds: z.array(z.string()),
  courseId: z.string()
});

export const courseMemberRouter = router({
  createCourseMember: elevatedCourseMemberCourseProcedure
    .input(zCourseMember)
    .mutation(async (requestData) => {
      try {
        const { courseId, email, name, role } = requestData.input;
        zCourseRoles.parse(role);

        if (!courseId || !email || !name || !role) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Missing required fields'
            })
          );
        }

        const { hashEmails } = requestData.ctx.settings;
        requestData.input.email = hashEmails ? hashEmail(email) : email;

        const resEnrollment = await createCourseMember(requestData.input);
        return { success: true, resEnrollment };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  deleteCourseMembers: elevatedCourseMemberCourseProcedure
    .input(zDeleteCourseMembersFromCourse)
    .mutation(async (requestData) => {
      try {
        // Check if there are valid IDs to delete
        if (requestData.input.courseMemberIds.length === 0) {
          throw new Error('No valid course member IDs provided');
        }

        // Delete course members by their IDs
        await prisma.courseMember.deleteMany({
          where: {
            id: {
              in: requestData.input.courseMemberIds
            },
            // We need to make sure that the user is not deleting courseMembers outside the course passed in the input.
            // This is to prevent users from deleting courseMembers from other courses.
            courseId: requestData.input.courseId
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
  getCourseMembersOfCourse: publicProcedure
    .input(zGetCourseMembersOfCourse)
    .query(async (requestData) => {
      try {
        if (requestData.input.courseId === '') {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Missing CourseId in getCourseMembersOfCourse'
            })
          );
        }

        const emailctx = requestData.ctx?.session?.email;

        if (!emailctx)
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'user does not have a session'
            })
          );

        const roleParseResult = zSiteRoles.safeParse(
          requestData.ctx.session?.role
        );
        const isAdmin =
          roleParseResult.success &&
          roleParseResult.data === zSiteRoles.enum.admin;

        const courseMembership = await prisma.courseMember.findFirst({
          where: {
            courseId: requestData.input.courseId,
            email: emailctx
          }
        });

        if (!isAdmin) {
          if (!courseMembership) {
            throw generateTypedError(
              new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                  'No course membership found for this user in this course'
              })
            );
          }

          if (courseMembership.role !== zCourseRoles.enum.teacher) {
            return {
              success: true,
              courseMembers: [courseMembership],
              courseMembership: courseMembership
            };
          }
        }

        const courseMembers = await prisma.courseMember.findMany({
          where: {
            courseId: requestData.input.courseId
          },
          orderBy: {
            name: 'asc'
          }
        });

        return {
          success: true,
          courseMembers: courseMembers,
          courseMembership: courseMembership
        };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  /* 
  Loop through all courseMembers and create an array of course 
  member creation/update promises.
  Either update existing course member or create a new one. 
  Resolve all course member creation promises.
   */
  createMultipleCourseMembers: elevatedCourseMemberCourseProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        const {
          input: { courseId, courseMembers },
          ctx: { settings, session }
        } = requestData;
        const { hashEmails } = settings;
        const updatedCourseMembers = [];
        if (session && typeof session.email === 'string') {
          // Filter out the course members with email matching session.user
          const filteredCourseMembers = courseMembers.filter(
            (memberData) => memberData.email !== session.email
          );
          // Create an array to store promises for member creation or update
          const memberPromises = filteredCourseMembers.map(
            async (memberData) => {
              memberData.email = hashEmails
                ? hashEmail(memberData.email)
                : memberData.email;

              const existingMember = await findCourseMember(
                memberData.email,
                courseId
              );

              if (existingMember) {
                return updateCourseMember(existingMember.id, memberData);
              } else {
                return createCourseMember({ ...memberData, courseId });
              }
            }
          );

          const courseMemberResults = await Promise.all(memberPromises);
          updatedCourseMembers.push(...courseMemberResults);

          return {
            success: true,
            allCourseMembersOfClass: updatedCourseMembers
          };
        }
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
