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
  courseMemberId: z.string()
});

export const zFindCourseMember = z.object({
  courseId: z.string(),
  email: z.string()
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

    MarkAttendance: publicProcedure
    .input(zMarkAttendance)
    .mutation(async ({ input }) => {
      try {
        const courseId = input.courseId;
        const courseMemberId = input.courseMemberId;
       

        const { id } = await prisma.attendanceEntry.create({
          data: {
            courseId: courseId,
            courseMemberId: courseMemberId,
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

    FindCourseMember: publicProcedure
    .input(zFindCourseMember)
    .mutation(async ({ input }) => {
      try {
        const courseId = input.courseId;
        const email = input.email;
       
        const id = await prisma.courseMember.findFirst({
          where: {
            courseId: courseId,
            email: email,
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
    })
});
