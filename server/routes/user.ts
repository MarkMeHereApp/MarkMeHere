/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import { CourseMember } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';

export const zCreateUser = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string()
});

export const zCreateStudentUser = z.object({
  name: z.string(),
  email: z.string()
});

export const courseRouter = router({
  /*
  Admins have permssion to create any type of user account
  */
  createUser: publicProcedure
    .input(zCreateUser)
    .mutation(async (requestData) => {
      try {
        const { name, email, role } = requestData.input;

        await prisma.user.create({
          data: {
            name,
            email,
            role
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  /*
  Faculty have permission to create student user accounts
  (This allows the professor to manually create students)
  */
  createStudentUser: publicProcedure
    .input(zCreateStudentUser)
    .mutation(async (requestData) => {
      try {
        const { name, email } = requestData.input;
        await prisma.user.create({
          data: {
            name,
            email,
            role: 'student'
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  /*
  Faculty have permission to create student user accounts
  (This allows the professor to create accounts for course members that do not have one)
  (Will be used for the CSV upload)
  */
  createMultipleStudentUsers: publicProcedure
    .input(zCreateUser)
    .mutation(async (requestData) => {
      try {
        const { name, email, role } = requestData.input;
        const resCourse = await prisma.user.create({
          data: {
            name,
            email,
            role
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type CourseRouter = typeof courseRouter;
