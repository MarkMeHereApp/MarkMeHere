
/* -------- Only Professors or TA's can access these routes -------- */

import { elevatedCourseMemberLectureProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { AttendanceEntry } from '@prisma/client';

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

export const attendanceRouter = router({
  createOrUpdateSingleAttendanceEntry: elevatedCourseMemberLectureProcedure
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
  createManyAttendanceRecords: elevatedCourseMemberLectureProcedure
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
