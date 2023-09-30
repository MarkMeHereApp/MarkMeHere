import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { request } from 'http';

export const zGetLecturesOfCourse = z.object({
  courseId: z.string()
});

export const zTryGetLectureFromDate = z.object({
  courseId: z.string(),
  lectureDate: z.date()
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
  // This function returns the lecture object, and if returnAttendance is true, it also returns the attendance entries for that lecture.
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
  getAllLecturesAndAttendance: publicProcedure
    .input(zGetLecturesOfCourse)

    .query(async (requestData) => {
      try {
        const lectures = await prisma.lecture.findMany({
          where: {
            courseId: requestData.input.courseId
          },
          include: {
            attendanceEntries: true
          }
        });
        return { success: true, lectures };
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
        const newLecture = await prisma.lecture.create({
          data: {
            courseId: requestData.input.courseId,
            lectureDate: requestData.input.lectureDate
          }
        });

        if (newLecture) {
          return { success: true, newLecture };
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
