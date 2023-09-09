import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number()
});

export const zQRCode = z.object({
  qr: z.string()
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
                lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
              }
            }
          });

          return { success: true, qrCode: returnCode };
        } catch (error) {
          throw generateTypedError(error as Error);
        }
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  //Search qrcode table for QRCode sent by the user


  //http://localhost:3000/api/trpc/qr.ValidateQRCode?input=MTEATD
  ValidateQRCode: publicProcedure
    .input(zQRCode)
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
