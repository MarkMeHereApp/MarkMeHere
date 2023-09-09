import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import {
  zAttendanceStatus,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';

export const zGetCourseMembersOfLecture = z.object({
  lectureId: z.string()
});
export const zGetCourseMembersOfLectureFromDate = z.object({
  date: z.date(),
  courseId: z.string()
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
        throw generateTypedError(error as Error);
      }
    }),

  getAttendanceDateofCourseFromDate: publicProcedure

    .input(zGetCourseMembersOfLectureFromDate)
    .query(async (requestData) => {
      try {
        const lectures = await prisma.lecture.findMany({
          where: {
            lectureDate: requestData.input.date,
            courseId: requestData.input.courseId
          },
          include: {
            attendanceEntries: true
          }
        });
        if (!lectures || lectures.length === 0) {
          throw generateTypedError(
            new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message:
                'Multiple of lectures exist on the same day. This should never happen'
            })
          );
        }

        const lecture = lectures[0]; // There should only be one lecture on a given day
        const attendanceEntries = await prisma.attendanceEntry
          .findMany({
            where: {
              lectureId: lecture.id
            }
          })
          .then((entries) =>
            entries.map((entry) => ({
              ...entry,
              status: zAttendanceStatus.parse(entry.status)
            }))
          );

        const knownCourseMembers = attendanceEntries.map(
          (entry) => entry.courseMemberId
        );

        const courseMembers = await prisma.courseMember.findMany({
          where: {
            courseId: requestData.input.courseId,
            id: {
              notIn: knownCourseMembers
            }
          }
        });

        interface AttendanceEntryMapped {
          courseMemberId: string;
          checkInDate: Date | null;
          status: zAttendanceStatusType;
        }

        if (!courseMembers || courseMembers.length === 0) {
          return { success: true, attendanceEntriesMapped: [] };
        }

        const attendanceEntriesMapped: AttendanceEntryMapped[] =
          courseMembers.map((courseMember) => {
            const attendanceEntry = attendanceEntries.find(
              (entry) => entry.courseMemberId === courseMember.id
            );
            if (attendanceEntry) {
              return {
                courseMemberId: courseMember.id,
                checkInDate: attendanceEntry.checkInDate || null,
                status: zAttendanceStatus.parse(attendanceEntry.status)
              };
            } else {
              return {
                courseMemberId: courseMember.id,
                checkInDate: null,
                status: zAttendanceStatus.parse('absent')
              };
            }
          });
        return { success: true, attendanceEntriesMapped };
      } catch (error) {
        throw generateTypedError(error as Error);
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
            throw generateTypedError(error as Error);
          }
        }

        return { success: true, newAttendanceEntry };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type AttendaceRouter = typeof attendanceRouter;
