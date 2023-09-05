import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zGetLecturesOfCourse = z.object({
  courseId: z.string()
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
        throw new Error('Error getting lectures');
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
          throw new Error(`A lecture already exists for ${requestData.input.lectureDate}`);
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
        throw new Error('Error creating lecture');
      } catch (error) {
        throw new Error('Error creating lecture');
      }
    })
});

export type LectureRouter = typeof lectureRouter;
