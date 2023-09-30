import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const zActiveCode = z.object({
  code: z.string()
})

export const attendanceTokenRouter = router({

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

        const { token } = await prisma.attendanceToken.create({
          data: {
            lectureId: qrResult.lectureId,
            token:  uuidv4()
          }
        });

        return { success: true, token: token };
      } catch (error) {
        throw error;
      }
    }),
})


