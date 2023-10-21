import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';

export const zGenerateNewAdmin = z.object({
  adminSecret: z.string()
});

export const zActiveCode = z.object({
  code: z.string()
});

export const sessionlessRouter = router({
  GenerateNewAdmin: publicProcedure
    .input(zGenerateNewAdmin)
    .mutation(async ({ input }) => {
      try {
        if (input.adminSecret === process.env.ADMIN_SECRET) {
        }

        return { success: true };
      } catch (error) {
        throw error;
      }
    }),

  ValidateAndCreateAttendanceToken: publicProcedure
    .input(zActiveCode)
    .mutation(async ({ input }) => {
      try {
        const qrResult = await prisma.qrcode.findUnique({
          where: {
            code: input.code
          }
        });

        if (qrResult === null) {
          return { success: false };
        }

        const { id } = await prisma.attendanceToken.create({
          data: {
            lectureId: qrResult.lectureId,
            token: uuidv4()
          }
        });

        return { success: true, token: id };
      } catch (error) {
        throw error;
      }
    })
});

export type SessionlessRouter = typeof sessionlessRouter;
