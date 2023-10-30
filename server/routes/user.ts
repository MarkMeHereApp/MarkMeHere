/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { hashEmail } from '../utils/hashedUserHelpers';

export const zCreateUser = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
  optionalId: z.string().optional()
});

export const zUpdateUser = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  optionalId: z.string().optional()
});

export const zDeleteUser = z.object({
  email: z.array(z.string())
});

export const userRouter = router({
  /*
  Admins have permssion to create any type of user account
  */

  // Create User
  createUser: publicProcedure
    .input(zCreateUser)
    .mutation(async (requestData) => {
      try {
        const { name, email, role, optionalId } = requestData.input;
        const { hashEmails } = requestData.ctx.settings;

        zSiteRoles.parse(role);
        if (!name || !email || !role) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Missing required fields'
            })
          );
        }

        const newUser = await prisma.user.create({
          data: {
            name,
            email: hashEmails ? hashEmail(email) : email,
            role,
            optionalId
          }
        });

        return { success: true, user: newUser };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  // get All Users
  getAllUsers: publicProcedure.query(async () => {
    try {
      const users = await prisma.user.findMany();
      return {
        success: true,
        users: users
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }),

  // Update User
  updateUser: publicProcedure
    .input(zUpdateUser)
    .mutation(async (requestData) => {
      const { email, name, role, optionalId } = requestData.input;

      const existingUser = await prisma.user.findUnique({
        where: { email: email }
      });
      if (!existingUser) {
        throw generateTypedError(
          new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          })
        );
      }

      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          name: name || existingUser.name,
          email: email || existingUser.email,
          role: role || existingUser.role,
          optionalId: optionalId || existingUser.optionalId
        }
      });

      return { success: true, user: updatedUser };
    }),

  // Delete User by Email
  deleteUser: publicProcedure
    .input(zDeleteUser)
    .mutation(async (requestData) => {
      try {
        // Check if there are valid IDs to delete
        if (requestData.input.email.length === 0) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No Emails provided'
            })
          );
        }

        const emailContext = requestData.ctx.session?.email;

        if (!emailContext) {
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'No email context!'
            })
          );
        }

        if (requestData.input.email.find((email) => email === emailContext)) {
          throw generateTypedError(
            new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You cannot delete yourself!'
            })
          );
        }

        // Delete users by their IDs
        const deleteResponse = await prisma.user.deleteMany({
          where: {
            email: {
              in: requestData.input.email
            }
          }
        });

        if (deleteResponse.count === 0) {
          throw generateTypedError(
            new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'No Users were deleted!'
            })
          );
        }

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type UserRouter = typeof userRouter;
