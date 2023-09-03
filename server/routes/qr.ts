import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number()
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

        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + requestData.input.secondsToExpireNewCode
        );

        try {
          const returnCode = await prisma.qrcode.create({
            data: {
              code: newCode,
              expiresAt: newExpiry
            }
          });

          await prisma.qrcode.deleteMany({
            where: {
              expiresAt: {
                lte: new Date()
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
    })
});
