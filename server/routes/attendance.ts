import { publicProcedure, professorProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import {
  zAttendanceStatus,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { AttendanceEntry } from '@prisma/client';

export const zGetCourseMembersOfLecture = z.object({
  lectureId: z.string()
});
export const zGetCourseMembersOfLectureFromDate = z.object({
  date: z.date(),
  courseId: z.string()
});

export const zCreateNewManyAttendanceRequest = z.object({
  lectureId: z.string(),
  attendanceStatus: z.string(),
  courseMemberIds: z.array(z.string())
});

export const zCreateOrUpdateSingleAttendanceRequest = z.object({
  lectureId: z.string(),
  attendanceStatus: z.string(),
  courseMemberId: z.string()
});

export const zDeleteAttendanceEntries = z.object({
  lectureId: z.string(),
  courseMemberIds: z.array(z.string())
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
          dateMarked: Date | null;
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
                dateMarked: attendanceEntry.dateMarked || null,
                status: zAttendanceStatus.parse(attendanceEntry.status)
              };
            } else {
              return {
                courseMemberId: courseMember.id,
                dateMarked: null,
                status: zAttendanceStatus.parse('absent')
              };
            }
          });
        return { success: true, attendanceEntriesMapped };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  createOrUpdateSingleAttendanceEntry: professorProcedure
    .input(zCreateOrUpdateSingleAttendanceRequest)
    .mutation(async (requestData) => {
      try {
        const existingAttendanceEntry = await prisma.attendanceEntry.findFirst({
          where: {
            lectureId: requestData.input.lectureId,
            courseMemberId: requestData.input.courseMemberId
          }
        });

        let attendanceEntry: AttendanceEntry | null = null;

        if (existingAttendanceEntry) {
          attendanceEntry = await prisma.attendanceEntry.update({
            where: {
              id: existingAttendanceEntry.id
            },
            data: {
              status: requestData.input.attendanceStatus,
              dateMarked: new Date(Date.now())
            }
          });
        } else {
          attendanceEntry = await prisma.attendanceEntry.create({
            data: {
              lectureId: requestData.input.lectureId,
              courseMemberId: requestData.input.courseMemberId,
              status: requestData.input.attendanceStatus
            }
          });
        }
        if (!attendanceEntry) {
          throw new Error('could not create/update attendance entry');
        }
        return { success: true, attendanceEntry };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),

  createManyAttendanceRecords: publicProcedure
    .input(zCreateNewManyAttendanceRequest)
    .mutation(async (requestData) => {
      try {
        // Get the existing attendance entries for the lecture
        const existingAttendanceEntries = await prisma.attendanceEntry.findMany(
          {
            where: {
              lectureId: requestData.input.lectureId
            }
          }
        );

        // Get the courseMemberIds of the existing attendance entries
        const existingAttendanceEntriesIds = existingAttendanceEntries.map(
          (entry) => entry.courseMemberId
        );

        // Get the courseMemberIds of the courseMembers that are having attendance entries updated
        const matchingEntries = requestData.input.courseMemberIds.filter(
          (entry) => {
            return existingAttendanceEntriesIds.includes(entry);
          }
        );

        // Update the existing attendance entries to the new status
        await prisma.attendanceEntry.updateMany({
          where: {
            courseMemberId: {
              in: matchingEntries
            }
          },
          data: {
            status: requestData.input.attendanceStatus
          }
        });

        // Get the courseMemberIds of the courseMembers that don't have attendance entries (absent members)
        const courseMembersWithoutEntriesIds =
          requestData.input.courseMemberIds.filter(
            (courseMemberId) =>
              !existingAttendanceEntriesIds.includes(courseMemberId)
          );

        // Create attendance entries for those absent members
        await prisma.attendanceEntry.createMany({
          data: courseMembersWithoutEntriesIds.map((courseMemberId) => ({
            lectureId: requestData.input.lectureId,
            courseMemberId: courseMemberId,
            status: requestData.input.attendanceStatus
          }))
        });

        // Refetch the updated attendance entries to return
        const updatedAttendanceEntries = await prisma.attendanceEntry.findMany({
          where: {
            lectureId: requestData.input.lectureId
          }
        });

        return { success: true, updatedAttendanceEntries };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type AttendaceRouter = typeof attendanceRouter;
