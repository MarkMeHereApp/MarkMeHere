/* -------- These routes do not need to exist. They can exist as Prisma calls
directly to the backend from the submit endpoint  -------- */

import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { v4 as uuidv4 } from 'uuid';

export const zValidateCode = z.object({
  qr: z.string()
});

export const zCreateAttendanceToken = z.object({
  lectureId: z.string()
});

export const recordQRAttendanceRouter = router({
  ValidateQRCode: publicProcedure
    .input(zValidateCode)
    .query(async ({ input }) => {
      try {
        const qr = input.qr;

        const qrRow = await prisma.qrcode.findFirst({
          where: {
            code: qr
          }
        });

        if (qrRow) {
          return { success: true, qrRow: qrRow };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw new Error('Error finding QR code');
      }
    }),

  /* 
  Create attendance token used to authenticate user attendance even 
  after QR code expires
  */
  CreateAttendanceToken: publicProcedure
    .input(zCreateAttendanceToken)
    .mutation(async ({ input }) => {
      try {
        const token = uuidv4();
        const lectureId = input.lectureId;

        const { id } = await prisma.attendanceToken.create({
          data: {
            token: token,
            lectureId: lectureId
          }
        });

        //Return the id of the token instead of the token itself
        return { token: id };
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to create attendance token'
        );
      }
    })
});
