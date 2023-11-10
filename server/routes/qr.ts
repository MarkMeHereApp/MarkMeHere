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
  professorLectureGeolocationId: z.union([z.string(), z.null()]),
});

export const qrRouter = router({
  CreateNewQRCode: elevatedCourseMemberCourseProcedure
    .input(zCreateQRCode)
    .mutation(async ({ input }) => {
      try {
        let newCode: string | null = null;
        for (let i = 0; i < 10; i++) {
          newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          const existingCode = await redis.hget('qrCode:' + newCode, 'code');

          if (existingCode === null) {
            break;
          }
        }

        if (newCode === null) {
          throw new Error('Could not create a duplicate QR code.');
        }

        const { lectureId, courseId, professorLectureGeolocationId } = input;
        const gracePeriod = 15;
        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + input.secondsToExpireNewCode
        );

        console.log(
          'qrCode: ' + newCode + ' expiry: ' + newExpiry.getSeconds()
        );

        const qrCodeObj: zQrCodeType = {
          code: newCode,
          lectureId,
          courseId,
          professorLectureGeolocationId,
          expiresAt: newExpiry,
          lengthOfTime: null
        };
        const qrKey = 'qrCode:' + newCode;
        const multi = redis.multi();

        if (professorLectureGeolocationId) {
          try {
            await multi
              .hset(qrKey, qrCodeObj)
              .expire(qrKey, newExpiry.getSeconds() + gracePeriod)
              .exec();

            return { success: true, qrCode: qrCodeObj };
          } catch (error) {
            throw error;
          }
        } else {
          try {
            /*
            Store qr code in Redis
            We no longer need to delete old codes as Redis will
            delete them 
            */
            await multi
              .hset(qrKey, qrCodeObj)
              .expire(qrKey, newExpiry.getSeconds() + gracePeriod)
              .exec();

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
