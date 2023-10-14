/* -------- Only users with an Admin or Moderator site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { zSiteRoles } from '@/types/sharedZodTypes';

export const zCreateUser = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string()
});

export const zUpdateUser = z.object({
  userId: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional()
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
        const { name, email, role } = requestData.input;
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
            email,
            role
          }
        });

        return { success: true, user: newUser };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  // Read User by ID
  getUserByEmail: publicProcedure.input(z.string()).query(async (email) => {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      throw generateTypedError(
        new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        })
      );
    }

    return user;
  }),

  // Read All Users
  getAllUsers: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),

  // Update User
  updateUser: publicProcedure
    .input(zUpdateUser)
    .mutation(async (requestData) => {
      const { userId, name, email, role } = requestData.input;

      if (!name && !email && !role) {
        throw generateTypedError(
          new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No updates provided'
          })
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
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
        where: { id: userId },
        data: {
          name: name || existingUser.name,
          email: email || existingUser.email,
          role: role || existingUser.role
        }
      });

      return { success: true, user: updatedUser };
    }),

  // Delete User by Email
  deleteUser: publicProcedure.input(z.string()).mutation(async (email) => {
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

    await prisma.user.delete({
      where: { email: email }
    });

    return { success: true };
  })
});

export type UserRouter = typeof userRouter;
