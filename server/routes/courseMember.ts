/* -------- Only Professors or TA's can access these routes -------- */

import {
  elevatedCourseMemberCourseProcedure,
  publicProcedure,
  router
} from '../trpc';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';

import { z } from 'zod';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';
import prismaAdapterHashed from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterHashed';
import {
  createHashedCourseMember,
  CreateHashedCourseMemberType,
  findHashedCourseMember
} from '../utils/hashedCourseMemberHelpers.ts';
import {
  createDefaultCourseMember,
  CourseMemberInput,
  CreateDefaultCourseMemberType,
  findDefaultCourseMember
} from '../utils/defaultCourseMemberHelpers.ts';
import { CourseMember } from '@prisma/client';

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
  createCourseMember: elevatedCourseMemberCourseProcedure
    .input(zCourseMember)
    .mutation(async (requestData) => {
      try {
        async function createAndReturnCourseMember(
          createFunction:
            | CreateDefaultCourseMemberType
            | CreateHashedCourseMemberType
        ) {
          const resEnrollment = await createFunction(requestData.input);
          return { success: true, resEnrollment };
        }

        const { courseId, email, name, role } = requestData.input;
        const { settings } = requestData.ctx;

        zCourseRoles.parse(role);

        if (!courseId || !email || !name || !role) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Missing required fields'
            })
          );
        }

        return await createAndReturnCourseMember(
          settings?.hashEmails
            ? createHashedCourseMember
            : createDefaultCourseMember
        );
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
              message:
                'There should only be one course member with this email and id'
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

  // TODO: If there is duplicate data, overwrite the existing data.
  createMultipleCourseMembers: publicProcedure
    .input(zCreateMultipleCourseMembers)
    .mutation(async (requestData) => {
      try {
        const courseId = requestData.input.courseId;
        const courseMembers = requestData.input.courseMembers;
        const { settings } = requestData.ctx;
        const upsertedCourseMembers = [];

        async function createAndReturnCourseMember(
          createFunction:
            | CreateDefaultCourseMemberType
            | CreateHashedCourseMemberType,
          courseMember: CourseMemberInput
        ) {
          const resEnrollment = await createFunction(courseMember);
          return resEnrollment;
        }

        for (const memberData of courseMembers) {
          const { email } = memberData;

          //Check if emails are hashed or not to use the correct search function
          const searchFunction = settings.hashEmails
            ? findHashedCourseMember
            : findDefaultCourseMember;
          const existingMember = await searchFunction(courseId, email);

          if (existingMember) {
            //If the course member exists update the row
            const updatedMember = await prisma.courseMember.update({
              where: { id: existingMember.id },
              data: memberData
            });
            upsertedCourseMembers.push(updatedMember);
          } else {
            // If the course member does not exist create the courseMember along with the user
            //If it does not exist
            const createdMember = await prisma.courseMember.create({
              data: {
                ...memberData,
                courseId
              }
            });
            upsertedCourseMembers.push(createdMember);
          }

          // If optionalId is null or undefined, treat it as a new member (first-time import)

          const createdMember = await createAndReturnCourseMember(
            settings?.hashEmails
              ? createHashedCourseMember
              : createDefaultCourseMember,
            { ...memberData, courseId }
          );

          upsertedCourseMembers.push(createdMember);
        }

        // Fetch all course members after the upsert operation
        // const allCourseMembersOfClass = await prisma.courseMember.findMany({
        //   where: {
        //     courseId
        //   }
        // });

        return { success: true, upsertedCourseMembers };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseMemberRouter = typeof courseMemberRouter;
