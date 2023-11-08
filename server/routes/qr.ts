/* -------- Only Professors or TA's can access these routes -------- */

import { router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { kv as redis } from '@vercel/kv';
import { zQrCodeType } from '@/types/sharedZodTypes';
import elevatedCourseMemberCourseProcedure from '../middleware/elevatedCourseMemberCourseProcedure';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number(),
  lectureId: z.string(),
  courseId: z.string(),
  professorLectureGeolocationId: z.string()
});

export const qrRouter = router({
  CreateNewQRCode: elevatedCourseMemberCourseProcedure
    .input(zCreateQRCode)
    .mutation(async ({ input }) => {
      try {
        let newCode: string | null = null;
        for (let i = 0; i < 10; i++) {
          newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

          const existingCode = await prisma.qrcode.findUnique({
            where: {
              code: newCode
            }
          });

          if (existingCode === null) {
            break;
          }
        }

        if (newCode === null) {
          throw new Error('Could not create a duplicate QR code.');
        }

        const lectureId = input.lectureId;
        const courseId = input.courseId;
        const professorLectureGeolocationId =
          input.professorLectureGeolocationId;

        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + input.secondsToExpireNewCode
        );

        const qrCodeObj: zQrCodeType = {
          code: newCode,
          lectureId,
          courseId,
          professorLectureGeolocationId,
          expiresAt: newExpiry
        };
        const qrKey = 'qrCode:' + newCode;
        const multi = redis.multi();

        if (professorLectureGeolocationId) {
          try {
            await multi.hset(qrKey, qrCodeObj).expire(qrKey, 15).exec();
            // const returnCode = await prisma.qrcode.create({
            //   data: {
            //     code: newCode,
            //     lectureId: lectureId,
            //     courseId: courseId,
            //     expiresAt: newExpiry,
            //     ProfessorLectureGeolocationId: professorLectureGeolocationId
            //   }
            // });

            // await prisma.qrcode.deleteMany({
            //   where: {
            //     expiresAt: {
            //       lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
            //     }
            //   }
            // });

            return { success: true, qrCode: qrCodeObj };
          } catch (error) {
            throw error;
          }
        } else {
          try {
            /*
            Store qr code in Redis
            We no longer need to delete old codes as Redis will
            delete them for us after 15 seconds
            */
            await multi.hset(qrKey, qrCodeObj).expire(qrKey, 15).exec();

            //const data = await redis.hget("qrCode:" + newCode, 'name');
            // const returnCode = await prisma.qrcode.create({
            //   data: {
            //     code: newCode,
            //     lectureId: lectureId,
            //     courseId: courseId,
            //     expiresAt: newExpiry,
            //   }
            // });

            // await prisma.qrcode.deleteMany({
            //   where: {
            //     expiresAt: {
            //       lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
            //     }
            //   }
            // });

            return { success: true, qrCode: qrCodeObj };
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        throw error;
      }
    })
});
