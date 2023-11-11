import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';

import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';
import { kv as redis } from '@vercel/kv';
import { zAttendanceTokenType, zQrCodeType } from '@/types/sharedZodTypes';
import { redisAttendanceKey, redisQrCodeKey } from '@/utils/globalFunctions';

const zCreateOrganization = z.object({
  name: z.string(),
  uniqueCode: z.string()
});

export const zActiveCode = z.object({
  code: z.string()
});

export const sessionlessRouter = router({
  createOrganization: publicProcedure
    .input(zCreateOrganization)
    .mutation(async (requestData) => {
      try {
        const existingOrg = await prisma.organization.findFirst();

        if (existingOrg) {
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message:
                'An Organization already exists in the database. We do not support adding more than one organization at this time.'
            })
          );
        }

        return await prisma.organization.create({
          data: {
            name: requestData.input.name,
            uniqueCode: requestData.input.uniqueCode.toLowerCase(),
            hashEmails: false
          }
        });
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  ValidateAndCreateAttendanceToken: publicProcedure
    .input(zActiveCode)
    .mutation(async ({ input }) => {
      try {
        //Find qrCode
        const { code } = input;

        const qrResult: zQrCodeType | null = await redis.hgetall(
          redisQrCodeKey(code)
        );

        if (!qrResult) return { success: false };

        //Find course
        const course = await prisma.course.findUnique({
          where: {
            id: qrResult.courseId
          }
        });

        if (!course) return { success: false };

        const attendanceToken = uuidv4();
        const attendanceTokenId = uuidv4();
        const attendanceTokenKey = 'attendanceToken:' + attendanceTokenId;

        //Create attendance token
        const attendanceTokenObj: zAttendanceTokenType = {
          token: attendanceToken,
          courseId: qrResult.courseId,
          lectureId: qrResult.lectureId,
          professorLectureGeolocationId: qrResult.professorLectureGeolocationId,
          attendanceStudentLatitude: null,
          attendanceStudentLongitude: null,
          createdAt: new Date()
        };

        await redis
          .multi()
          .hset(redisAttendanceKey(attendanceTokenId), attendanceTokenObj)
          .expire(attendanceTokenKey, 300)
          .exec();

        return {
          success: true,
          token: attendanceTokenId,
          location: qrResult.professorLectureGeolocationId,
          organizationCode: course.organizationCode,
          courseCode: course.courseCode
        };
      } catch (error) {
        throw error;
      }
    })
});

export type SessionlessRouter = typeof sessionlessRouter;
