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
        const newCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();

        await prisma.qrcode.create({
          data: {
            code: newCode
          }
        });

        try {
          const deletedCodes = await prisma.qrcode.deleteMany({
            where: {
              code: {
                notIn: [requestData.input.activeCodeToSave, newCode].filter(
                  Boolean
                )
              }
            }
          });

          return { success: true, qrCode: newCode };
        } catch (error) {
          throw new Error('Error creating QR code');
        }
      } catch (error) {
        throw new Error('Error creating lecture');
      }
    })
});
