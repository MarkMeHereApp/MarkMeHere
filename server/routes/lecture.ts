/* -------- Only Professors or TA's can access these routes -------- */

import { router, publicProcedure } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import elevatedCourseMemberCourseProcedure from '../middleware/elevatedCourseMemberCourseProcedure';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';

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
        const siteRole = requestData.ctx.session?.role;
        const email = requestData.ctx.session?.email;

        if (!siteRole || !email)
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message:
                'getAllLecturesAndAttendance: User does not have a valid JWT'
            })
          );

        const courseMembership = await prisma.courseMember.findFirst({
          where: {
            courseId: requestData.input.courseId,
            email: email
          }
        });

        if (!courseMembership && siteRole !== zSiteRoles.enum.admin) {
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message:
                'getAllLecturesAndAttendance: User does not have a valid JWT'
            })
          );
        }

        const canAccessAllAttendanceEntries =
          siteRole === zSiteRoles.enum.admin ||
          (courseMembership &&
            courseMembership.role === zCourseRoles.enum.teacher);

        const lectures = await prisma.lecture.findMany({
          where: {
            courseId: requestData.input.courseId
          },
          include: {
            professorLectureGeolocation: true,
            attendanceEntries: canAccessAllAttendanceEntries
              ? true
              : {
                  where: {
                    courseMemberId: courseMembership?.id
                  }
                }
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
