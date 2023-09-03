import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zCreateQRCode = z.object({
  activeCodeToSave: z.string()
});

export const qrRouter = router({
  CreateNewQRCode: publicProcedure
    .input(zCreateQRCode)
    .mutation(async (requestData) => {
      try {
        await prisma.qrcode.deleteMany({
          where: {
            code: {
              not: {
                equals: requestData.input.activeCodeToSave
              }
            }
          }
        });

        const newCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        try {
          const returnCode = await prisma.qrcode.create({
            data: {
              code: newCode
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
