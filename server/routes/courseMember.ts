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
import {
  createMultipleCourseMembers,
  zCreateMultipleCourseMembers
} from '@/data/courseMember/create-multiple-course-members';
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

export const zDeleteCourseMembersFromCourse = z.object({
  courseMemberIds: z.array(z.string()),
  courseId: z.string()
});

export const zUpdateCourseMember = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional()
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
  updateCourseMember: publicProcedure
    .input(zUpdateCourseMember)
    .mutation(async (requestData) => {
      const { id, email, name, role } = requestData.input;
      const courseMember = await prisma.courseMember.update({
        where: { id },
        data: {
          name: name,
          email: email,
          role: role
        }
      });
      return { success: true, member: courseMember };
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
        return createMultipleCourseMembers(requestData.input);
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
