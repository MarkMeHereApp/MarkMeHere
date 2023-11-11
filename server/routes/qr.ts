/* -------- Only Professors or TA's can access these routes -------- */

import { router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { kv as redis } from '@vercel/kv';
import { zQrCodeType } from '@/types/sharedZodTypes';
import elevatedCourseMemberCourseProcedure from '../middleware/elevatedCourseMemberCourseProcedure';
import { redisQrCodeKey } from '@/utils/globalFunctions';
import { relative } from 'node:path/win32';

export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number(),
  lectureId: z.string(),
  courseId: z.string(),
  professorLectureGeolocationId: z.union([z.string(), z.null()])
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
        const newExpiry = new Date();
        newExpiry.setSeconds(
          newExpiry.getSeconds() + input.secondsToExpireNewCode
        );

        const qrCodeObj: zQrCodeType = {
          code: newCode,
          lectureId,
          courseId,
          professorLectureGeolocationId,
          expiresAt: newExpiry,
          lengthOfTime: null
        };

        const gracePeriod = 5;
        const currentTime = new Date();
        const relativeExpiry = Math.ceil(
          (qrCodeObj.expiresAt.getTime() - currentTime.getTime()) / 1000
        );
        const qrKey = redisQrCodeKey(newCode);
        const multi = redis.multi();

        if (professorLectureGeolocationId) {
          try {
            await multi
              .hset(qrKey, qrCodeObj)
              .expire(qrKey, relativeExpiry + gracePeriod)
              .exec();

            return { success: true, qrCode: qrCodeObj };
          } catch (error) {
            throw error;
          }
        } else {
          try {
            await multi
              .hset(qrKey, qrCodeObj)
              .expire(qrKey, relativeExpiry + gracePeriod)
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
