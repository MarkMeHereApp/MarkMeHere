/* -------- Only Professors or TA's can access these routes -------- */

import { router, elevatedCourseMemberCourseProcedure, publicProcedure } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { request } from 'http';

export const zGetLecturesOfCourse = z.object({
  courseId: z.string()
});

export const zCreateLecture = z.object({
  courseId: z.string(),
  lectureDate: z.date()
});

export const lectureRouter = router({
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
   
  

  CreateLecture: elevatedCourseMemberCourseProcedure
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
