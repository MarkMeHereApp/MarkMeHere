import { publicProcedure, router } from '../trpc';
import { AttendanceEntry, Lecture } from '@prisma/client';
import prisma from '@/prisma';
import { z } from 'zod';

export const zGetCourseMembersOfLecture = z.object({
  lectureId: z.string()
});

export const zCreateNewAttendanceRequest = z.object({
  lectureId: z.string(),
  courseMemberId: z.string(),
  attendanceStatus: z.string(),
  returnAllAttendanceEntries: z.boolean().optional().default(false)
});

export const attendanceRouter = router({
  getAttendanceDataOfCourse: publicProcedure
    .input(zGetCourseMembersOfLecture)
    .query(async (requestData) => {
      try {
        const attendanceEntries = await prisma.attendanceEntry.findMany({
          where: {
            lectureId: requestData.input.lectureId
          }
        });
        return { success: true, attendanceEntries };
      } catch (error) {
        throw new Error('Error getting attendance data');
      }
    }),
  updateSelectedCourseId: publicProcedure
    .input(zCreateNewAttendanceRequest)
    .mutation(async (requestData) => {
      try {
        const newAttendanceEntry = await prisma.attendanceEntry.create({
          data: {
            lectureId: requestData.input.lectureId,
            courseMemberId: requestData.input.courseMemberId,
            status: requestData.input.attendanceStatus
          }
        });
        if (requestData.input.returnAllAttendanceEntries) {
          try {
            const attendanceEntries = await prisma.attendanceEntry.findMany({
              where: {
                lectureId: requestData.input.lectureId
              }
            });
            return { success: true, attendanceEntries };
          } catch (error) {
            throw new Error('Error getting attendance data');
          }
        }

        return { success: true, newAttendanceEntry };
      } catch (error) {
        throw new Error('Error creating attendance data');
      }
    })
});

export type AttendaceRouter = typeof attendanceRouter;
