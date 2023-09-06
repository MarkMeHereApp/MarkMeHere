import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zGetLecturesOfCourse = z.object({
  courseId: z.string()
});

export const zCreateLecture = z.object({
  courseId: z.string()
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingLecture = await prisma.lecture.findFirst({
          where: {
            courseId: requestData.input.courseId,
            lectureDate: today
          }
        });
        if (existingLecture) {
          throw new Error('A lecture already exists for today');
        }
        const resLecture = await prisma.lecture.create({
          data: {
            courseId: requestData.input.courseId,
            lectureDate: today
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
