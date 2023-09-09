import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zValidateCode = z.object({
  qr: z.string(),
  courseId: z.string()
});

export const zCreateAttendanceToken = z.boolean();

export const recordQRAttendanceRouter = router({
  //Search qrcode table for QRCode sent by the user

  ValidateQRCode: publicProcedure.input(zValidateCode).query(async ({ input }) => {
    try {
      const qr = input.qr;
      const courseId = input.courseId;

      const storedQRCode = await prisma.qrcode.findFirst({
        where: {
          code: qr,
          courseId: courseId
        }
      });

      //Check if we find a code in our DB that matches the code sent by the user
      if (!!storedQRCode) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      throw new Error('Error finding QR code');
    }
  }),

  //Create a token that can be used to validate users who take too long to sign in 
  //before the QR code expires
  //The user will be given the token in the process so basically if their token exists 
  //In the database they are let through
  CreateAttendanceToken: publicProcedure
    .input(zValidateCode)
    .query(async ({ input }) => {
      try {
        console.log(input);
        const storedQRCode = await prisma.qrcode.findFirst({
          where: {
            code: input.qr
          }
        });

        //Check if we find a code in our DB that matches the code sent by the user
        if (!!storedQRCode) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw new Error('Error finding QR code');
      }
    })
});
