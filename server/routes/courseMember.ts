/* -------- Only Professors or TA's can access these routes -------- */

import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zCourseRoles } from '@/types/sharedZodTypes';
import { publicProcedure, router } from '../trpc';
import {
  createCourseMember,
  findCourseMember,
  updateCourseMember
} from '../utils/courseMemberHelpers';
import { hashEmail } from '../utils/userHelpers';
import elevatedCourseMemberCourseProcedure from '../middleware/elevatedCourseMemberCourseProcedure';
import { getServerSession } from 'next-auth';
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

/*
First we need to look up if email already exists in the user table.
If it exists then proceeed normally
If it does not exist we need to create a new user cooresponding with the couremember email
Then students who mark attendance for the first time will sign into an account
that was already created removing the need to create a new account everytime a
new student marks themselves present
*/

/* 
In the future lets focus on making this route compatible with hashed emails.
We need to do more testing concerning where the callback url takes us on successfull 
sign in
We really need to test if when we mark our attendance and a new user is created
we are taken to the correct url afterwards

In order to support password hashing when we add course members the teacher will need to provide
a plaintext email.
We cannot store this email.
So when a course member is added we will need to lookup the user using a bcrypt compare
with the plaintyext email and hashed email stored. 
If a matching hashed email is not found we will hash teh email and create the user.
We need to do this because of how hashing works inherently
*/

/* 
Create a course member, but check if emails are hashed.
If emails are hashed, create user along with coursemember 
if email does not already exist in user table.
*/

/* 
No matter if emails are hashed or not we are making a user
account if it does not exist 
*/

export const courseMemberRouter = router({
  createMultipleCourseMembers: publicProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        const {
          input: { courseId, courseMembers },
          ctx: { settings, session }
        } = requestData;
        const { hashEmails } = settings;
        const updatedCourseMembers = [];

        if (session && typeof session.user === 'string') {
          // Filter out the course members with email matching session.user
          const filteredCourseMembers = courseMembers.filter(
            (memberData) => memberData.email !== session.user
          );
          console.log(filteredCourseMembers);
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
        } else {
          // Handle the case where session is null or session.user is of an unexpected type
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'Invalid session or user data'
            })
          );
        }
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

        const courseMembership = await prisma.courseMember.findFirst({
          where: {
            courseId: requestData.input.courseId,
            email: emailctx
          }
        });

        if (!courseMembership) {
          throw generateTypedError(
            new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'No course membership found for this user in this course'
            })
          );
        }

        // @TODO check if user is admin
        const isAdmin = false;

        if (courseMembership.role === zCourseRoles.enum.student && !isAdmin) {
          return {
            success: true,
            courseMembers: [courseMembership],
            courseMembership: courseMembership
          };
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
  createMultipleCourseMembers: publicProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        const {
          input: { courseId, courseMembers },
          ctx: { settings }
        } = requestData;
        const { hashEmails } = settings;
        const updatedCourseMembers = [];

        // Create an array to store promises for member creation or update
        const memberPromises = courseMembers.map(async (memberData) => {
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
        });

        const courseMemberResults = await Promise.all(memberPromises);
        updatedCourseMembers.push(...courseMemberResults);

        return { success: true, allCourseMembersOfClass: updatedCourseMembers };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
