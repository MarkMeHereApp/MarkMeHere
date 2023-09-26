/* -------- Only users with an Admin or Faculty site role can access these routes -------- */

import { publicProcedure, router } from '../trpc';
import z from 'zod';
import { generateTypedError } from '@/server/errorTypes';
// Import Prisma client
import { PrismaClient } from '@prisma/client';
import {
  zLMSCourseSchemeType,
  zCreateCourseErrorStatus
} from '@/types/sharedZodTypes';
const prisma = new PrismaClient();
import { TRPCError } from '@trpc/server';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

const zCanvasCourseSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  course_code: z.string().nullable().optional(),
  start_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  enrollments: z.array(z.object({ role: z.string() })).default([]),
  total_students: z.number().nullable().optional(),
  ableToCreateCourse: z.boolean().default(true),
  createCourseErrorStatus: zCreateCourseErrorStatus.default('available')
});

export const canvasRouter = router({
  getCanvasCourses: publicProcedure
    .input(z.object({ userEmail: z.string().optional() }))
    .query(async (requestData) => {
      if (!CANVAS_API_TOKEN || !CANVAS_DOMAIN) {
        throw generateTypedError(
          new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'Canvas API token and domain not provided. Please contact your administrator.'
          })
        );
      }
      try {
        // First, get all the Canvas courses from the API Key
        const response = await fetch(
          `${CANVAS_DOMAIN}api/v1/courses?per_page=1000&enrollment_state=active&include=total_students`, //
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${CANVAS_API_TOKEN}`
            }
          }
        );

        const json = await response.json();

        // Check for errors in the response
        if (!response.ok) {
          let errorMessage = `${response.statusText}: `;
          if (json.errors && json.errors[0] && json.errors[0].message) {
            errorMessage += json.errors[0].message;
          } else {
            errorMessage += 'No error message provided';
          }

          throw generateTypedError(
            new TRPCError({
              code: 'PRECONDITION_FAILED',
              message: `Canvas Error: ${errorMessage})`
            })
          );
        }

        // Validate the data with Zod
        try {
          type CourseType = z.infer<typeof zCanvasCourseSchema>;

          const courses: CourseType[] = json.map((course: any) =>
            zCanvasCourseSchema.parse(course)
          );

          // Now we need to find out if any of these courses already exist in the database.
          const matchingCoursesLMSIds = await prisma.course.findMany({
            where: {
              lmsId: {
                in: courses.map((course) => course.id.toString())
              }
            },
            include: {
              enrollments: true
            }
          });

          matchingCoursesLMSIds.forEach((matchingCourse) => {
            const courseToUpdate = courses.find(
              (course) =>
                course.id.toString() === matchingCourse.lmsId &&
                matchingCourse.lmsType === 'canvas'
            );
            if (courseToUpdate) {
              courseToUpdate.ableToCreateCourse = false;
              courseToUpdate.createCourseErrorStatus =
                zCreateCourseErrorStatus.Enum.duplicate;

              // if the user is enrolled in this course, we should be more specific with the error.
              if (
                requestData.input.userEmail &&
                matchingCoursesLMSIds.some((course) =>
                  course.enrollments.some(
                    (enrollment) =>
                      enrollment.email === requestData.input.userEmail
                  )
                )
              ) {
                courseToUpdate.createCourseErrorStatus =
                  zCreateCourseErrorStatus.Enum.alreadyEnrolled;
              }
            }
          });

          //Only loop through available courses.
          for (const course of courses.filter(
            (course) => course.ableToCreateCourse
          )) {
            try {
              const enrollmentResponse = await fetch(
                `${CANVAS_DOMAIN}api/v1/courses/${course.id}/enrollments?per_page=1&include[]=email`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${CANVAS_API_TOKEN}`
                  }
                }
              );

              if (!enrollmentResponse.ok) {
                course.ableToCreateCourse = false;
                course.createCourseErrorStatus =
                  zCreateCourseErrorStatus.Enum.noEnrollmentAccess;
                continue;
              }

              const enrollmentJson = await enrollmentResponse.json();
              if (
                enrollmentJson &&
                enrollmentJson[0] &&
                enrollmentJson[0].user &&
                enrollmentJson[0].user.hasOwnProperty('email')
              ) {
                course.ableToCreateCourse = true;
              } else {
                course.ableToCreateCourse = false;
                course.createCourseErrorStatus =
                  zCreateCourseErrorStatus.Enum.noEmailAccess;
              }
            } catch (error) {
              throw generateTypedError(
                error as Error,
                `Failed to fetch enrollments for course ${course.id} from Canvas`
              );
            }
          }

          // Convert the schema of courseList to zLMSCourseScheme
          const convertedCourses: zLMSCourseSchemeType[] = courses.map(
            (course) => {
              return {
                lmsId: course.id.toString(),
                lmsType: 'canvas',
                name: course.name,
                course_code: course.course_code,
                start_at: course.start_at,
                end_at: course.end_at,
                enrollments: course.enrollments,
                totalStudents: course.total_students,
                ableToCreateCourse: course.ableToCreateCourse,
                createCourseErrorStatus: course.createCourseErrorStatus
              };
            }
          );

          return {
            success: true,
            courseList: convertedCourses
          };
        } catch (error) {
          throw generateTypedError(error as Error, `Unexpected Canvas Error`);
        }
      } catch (error) {
        throw generateTypedError(error as Error, `Unexpected Canvas Error`);
      }
    })
});

export type CanvasCoursesRouter = typeof canvasRouter;
