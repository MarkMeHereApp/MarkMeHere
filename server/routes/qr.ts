import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number(),
  courseId: z.string(),
  lectureId: z.string()
});

export const qrRouter = router({
  CreateNewQRCode: publicProcedure
    .input(zCreateQRCode)
    .mutation(async ({input}) => {
      try {
        const newCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        const courseId = input.courseId;
        const lectureId = input.courseId

        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + input.secondsToExpireNewCode
        );

        try {
          const returnCode = await prisma.qrcode.create({
            data: {
              code: newCode,
              lectureId: lectureId,
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
});
