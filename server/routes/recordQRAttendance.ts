import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { v4 as uuidv4 } from 'uuid';
import {
  zAttendanceStatus,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';

export const zValidateCode = z.object({
  qr: z.string()
});

export const zCreateAttendanceToken = z.object({
  lectureId: z.string()
});

export const zMarkAttendance = z.object({
  courseId: z.string(),
  courseMemberId: z.string(),
  status: zAttendanceStatus
});

export const zFindCourseMember = z.object({
  courseId: z.string(),
  email: z.string(),
  role: z.string()
});

export const zFindAttendanceToken = z.object({
  tokenId: z.string(),
  lectureId: z.string()
});

export const recordQRAttendanceRouter = router({
  //Search qrcode table for QRCode
  ValidateQRCode: publicProcedure
    .input(zValidateCode)
    .query(async ({ input }) => {
      try {
        const qr = input.qr;

        const qrRow = await prisma.qrcode.findFirst({
          where: {
            code: qr
          }
        });

        if (qrRow) {
          return { success: true, qrRow: qrRow }
        } else {
          return { success: false }
        }
      } catch (error) {
        throw new Error('Error finding QR code');
      }
    }),

  //Create a token that can be used to validate users who take too long to sign in
  //before the QR code expires
  //The user will be given the token in the process so if their token exists
  //In the database they can be marked as attended
  CreateAttendanceToken: publicProcedure
    .input(zCreateAttendanceToken)
    .mutation(async ({ input }) => {
      try {
        const token = uuidv4();
        const lectureId = input.lectureId;

        const { id } = await prisma.attendanceToken.create({
          data: {
            token: token,
            lectureId: lectureId
          }
        });

        //Return the id of the token instead of the token itself
        return { token: id };
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to create attendance token'
        );
      }
    }),

  //Create student attendance entry
  //We need to pass lecture id to attendance entry instead of courseId
  MarkAttendance: publicProcedure
    .input(zMarkAttendance)
    .mutation(async ({ input }) => {
      try {
        const courseId = input.courseId;
        const courseMemberId = input.courseMemberId;
        const status = input.status;

        console.log('c ' + courseId);
        console.log('c ' + courseMemberId);
        console.log('c ' + status);

        const attendanceEntry = await prisma.attendanceEntry.create({
          data: {
            lectureId: courseId,
            courseMemberId: courseMemberId,
            status: status
          }
        });

        if (!!attendanceEntry) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to create attendance entry'
        );
      }
    }),

  FindAttendanceToken: publicProcedure
    .input(zFindAttendanceToken)
    .mutation(async ({ input }) => {
      try {
        const tokenId = input.tokenId;
        const lectureId = input.lectureId;

        const tokenRow = await prisma.attendanceToken.findFirst({
          where: {
            id: tokenId,
            lectureId: lectureId
          }
        });

        if (!!tokenRow) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to find attendance token'
        );
      }
    }),

  FindCourseMember: publicProcedure
    .input(zFindCourseMember)
    .mutation(async ({ input }) => {
      try {
        const courseId = input.courseId;
        const email = input.email;
        const role = input.role;

        const courseMember = await prisma.courseMember.findFirst({
          where: {
            courseId: courseId,
            email: email,
            role: role
          }
        });

        //Return the course member attempting to mark attendance
        return { courseMember: courseMember };
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to create attendance token'
        );
      }
    })
});
