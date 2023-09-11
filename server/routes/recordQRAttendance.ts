import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { v4 as uuidv4 } from 'uuid';

export const zValidateCode = z.object({
  qr: z.string(),
  courseId: z.string()
});

export const zCreateAttendanceToken = z.object({
  courseId: z.string()
});

export const zMarkAttendance = z.object({
  courseId: z.string(),
  courseMemberId: z.string(),
  status: z.string()
});

export const zFindCourseMember = z.object({
  courseId: z.string(),
  email: z.string(),
  role: z.string()
});

export const zFindAttendanceToken = z.object({
  tokenId: z.string(),
  courseId: z.string()
});

export const recordQRAttendanceRouter = router({
  //Search qrcode table for QRCode and lectureId sent by the user

  ValidateQRCode: publicProcedure
    .input(zValidateCode)
    .query(async ({ input }) => {
      try {
        const qr = input.qr;
        const courseId = input.courseId;

        const storedQRCode = await prisma.qrcode.findFirst({
          where: {
            code: qr,
            courseId: courseId
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
        const courseId = input.courseId;

        const { id } = await prisma.attendanceToken.create({
          data: {
            token: token,
            courseId: courseId
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
        const courseId = input.courseId;

        const tokenRow = await prisma.attendanceToken.findFirst({
          where: {
            id: tokenId,
            courseId: courseId
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
          'Failed to create attendance token'
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
