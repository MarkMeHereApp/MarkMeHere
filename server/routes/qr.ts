import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number(),
  courseId: z.string()
});

export const zValidateCode = z.object({
  qr: z.string(),
  courseId: z.string()
});

export const qrRouter = router({
  CreateNewQRCode: publicProcedure
    .input(zCreateQRCode)
    .mutation(async (requestData) => {
      try {
        const newCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        const courseId = requestData.input.courseId;

        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + requestData.input.secondsToExpireNewCode
        );

        try {
          const returnCode = await prisma.qrcode.create({
            data: {
              code: newCode,
              courseId: courseId,
              expiresAt: newExpiry
            }
          });

          await prisma.qrcode.deleteMany({
            where: {
              expiresAt: {
                lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
              }
            }
          });

          return { success: true, qrCode: returnCode };
        } catch (error) {
          throw new Error('Error creating QR code');
        }
      } catch (error) {
        throw new Error('Error Removing QR code');
      }
    }),

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
