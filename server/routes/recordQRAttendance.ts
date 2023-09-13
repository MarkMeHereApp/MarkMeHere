import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { v4 as uuidv4 } from 'uuid';
import { zAttendanceStatus } from '@/types/sharedZodTypes';
import { AttendanceEntry } from '@prisma/client';

export const zValidateCode = z.object({
  qr: z.string()
});

export const zCreateAttendanceToken = z.object({
  lectureId: z.string()
});

export const zMarkAttendance = z.object({
  lectureId: z.string(),
  courseMemberId: z.string(),
  status: zAttendanceStatus
});

export const zFindAttendanceToken = z.object({
  tokenId: z.string(),
  lectureId: z.string()
});

export const zDeleteAttendanceToken = z.object({
  tokenId: z.string(),
  lectureId: z.string()
});

export const zFindCourseMember = z.object({
  courseId: z.string(),
  email: z.string(),
  role: z.string()
});

const zUseTokenToMarkAttendance = z.object({
  attendanceTokenId: z.string(),
  lectureId: z.string(),
  courseId: z.string(),
  email: z.string()
});

export const recordQRAttendanceRouter = router({
  /* 
  Search qrcode table for nonexpired QRCode 
  (still need to implement expiration functionality)
  */
  useTokenToMarkAttendance: publicProcedure
    .input(zUseTokenToMarkAttendance)
    .mutation(async ({ input }) => {
      try {
        const tokenRow = await prisma.attendanceToken.findFirst({
          where: {
            id: input.attendanceTokenId,
            lectureId: input.lectureId
          }
        });

        if (tokenRow) {
          const courseMember = await prisma.courseMember.findFirst({
            where: {
              courseId: input.courseId,
              email: input.email,
              role: 'student'
            }
          });

          if (courseMember) {
            const courseMemberId: string = courseMember.id;

            let attendanceEntry: AttendanceEntry | null = null;

            const existingAttendanceEntry =
              await prisma.attendanceEntry.findFirst({
                where: {
                  lectureId: input.lectureId,
                  courseMemberId: courseMemberId
                }
              });

            if (existingAttendanceEntry) {
              attendanceEntry = await prisma.attendanceEntry.update({
                where: {
                  id: existingAttendanceEntry.id
                },
                data: {
                  status: 'here'
                }
              });
            } else {
              attendanceEntry = await prisma.attendanceEntry.create({
                data: {
                  lectureId: input.lectureId,
                  courseMemberId: courseMemberId,
                  status: 'here'
                }
              });
            }

            await prisma.attendanceToken.delete({
              where: {
                id: input.attendanceTokenId,
                lectureId: input.lectureId
              }
            });

            if (!attendanceEntry) {
              throw new Error('could not create/update attendance entry');
            }

            return { success: true };
          } else {
            throw new Error('course member not found');
          }
        } else {
          throw new Error('invalid attendance token');
        }
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

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
          return { success: true, qrRow: qrRow };
        } else {
          return { success: false };
        }
      } catch (error) {
        throw new Error('Error finding QR code');
      }
    }),

  /* 
  Create attendance token used to authenticate user attendance even 
  after QR code expires
  */
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

  /* Create student attendance entry */
  MarkAttendance: publicProcedure
    .input(zMarkAttendance)
    .mutation(async ({ input }) => {
      try {
        const lectureId = input.lectureId;
        const courseMemberId = input.courseMemberId;
        const status = input.status;

        const attendanceEntry = await prisma.attendanceEntry.create({
          data: {
            lectureId: lectureId,
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

  /* Check if attendance token is valid */
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

  /* Delete used attendance token */
  DeleteAttendanceToken: publicProcedure
    .input(zDeleteAttendanceToken)
    .mutation(async ({ input }) => {
      try {
        const tokenId = input.tokenId;
        const lectureId = input.lectureId;

        await prisma.attendanceToken.delete({
          where: {
            id: tokenId,
            lectureId: lectureId
          }
        });

        return;
      } catch (error) {
        throw generateTypedError(
          error as Error,
          'Failed to find attendance token'
        );
      }
    }),

  /* Find course member */
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
