import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';

export const zGetLecturesOfCourse = z.object({
  courseId: z.string()
});

export const zTryGetLectureFromDate = z.object({
  courseId: z.string(),
  lectureDate: z.date(),
  returnAttendance: z.boolean().optional()
});

export const zCreateLecture = z.object({
  courseId: z.string(),
  lectureDate: z.date()
});

export const lectureRouter = router({
  getLecturesofCourse: publicProcedure
    .input(zGetLecturesOfCourse)
    .query(async (requestData) => {
      try {
        const lectures = await prisma.lecture.findMany({
          where: {
            courseId: requestData.input.courseId
          }
        });
        return { success: true, lectures };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  tryGetLectureFromDate: publicProcedure
    .input(zTryGetLectureFromDate)
    .query(async (requestData) => {
      try {
        const lectures = await prisma.lecture.findMany({
          where: {
            courseId: requestData.input.courseId,
            lectureDate: requestData.input.lectureDate
          }
        });

        if (lectures.length === 0) {
          return { success: false };
        }

        if (lectures.length > 1) {
          throw new Error(
            'More than one lecture found with the same date. This should never happen'
          );
        }

        if (lectures[0] && !requestData.input.returnAttendance) {
          return { success: true, lecture: lectures[0] };
        }

        try {
          const attendance = await prisma.attendanceEntry.findMany({
            where: {
              lectureId: lectures[0].id
            }
          });
          return { success: true, lecture: lectures[0], attendance };
        } catch (error) {
          throw generateTypedError(error as Error);
        }
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  CreateLecture: publicProcedure
    .input(zCreateLecture)
    .mutation(async (requestData) => {
      try {
        const existingLecture = await prisma.lecture.findFirst({
          where: {
            courseId: requestData.input.courseId,
            lectureDate: requestData.input.lectureDate
          }
        });
        if (existingLecture) {
          throw generateTypedError(
            new Error(
              `A lecture already exists for ${requestData.input.lectureDate}`
            )
          );
        }
        await prisma.lecture.create({
          data: {
            courseId: requestData.input.courseId,
            lectureDate: requestData.input.lectureDate
          }
        });
        const lectures = await prisma.lecture.findMany({
          where: {
            courseId: requestData.input.courseId
          }
        });

        if (lectures) {
          return { success: true, lectures };
        }
        throw generateTypedError(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create lecture'
          })
        );
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type LectureRouter = typeof lectureRouter;
