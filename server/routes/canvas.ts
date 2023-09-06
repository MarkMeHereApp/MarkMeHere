import { publicProcedure, router } from '../trpc';
import z from 'zod';
// Import Prisma client
import { PrismaClient } from '@prisma/client';
import {
  zLMSCourseScheme,
  zLMSCourseSchemeType,
  zCreateCourseErrors
} from '@/types/sharedZodTypes';
const prisma = new PrismaClient();

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

const zCanvasCourseSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  course_code: z.string().nullable().optional(),
  start_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  enrollments: z.array(z.object({ role: z.string() })).default([]),
  ableToCreateCourse: z.boolean().default(true),
  createCourseError: zCreateCourseErrors.nullable().optional()
});

export const canvasRouter = router({
  getCanvasCourses: publicProcedure
    .input(z.object({}))
    .query(async (requestData) => {
      if (!CANVAS_API_TOKEN || !CANVAS_DOMAIN) {
        throw new Error('Canvas API token and domain not provided');
      }
      try {
        const response = await fetch(
          `${CANVAS_DOMAIN}api/v1/courses?per_page=1000000&include[]=email`, //&enrollment_state=active
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${CANVAS_API_TOKEN}`
            }
          }
        );

        // Check for errors in the response
        if (!response.ok) {
          throw new Error(
            `Failed to fetch courses from Canvas: ${response.statusText}`
          );
        }
        const json = await response.json();
        // Validate the data with Zod
        try {
          type CourseType = z.infer<typeof zCanvasCourseSchema>;

          const courses: CourseType[] = json.map((course: any) =>
            zCanvasCourseSchema.parse(course)
          );

          for (const course of courses) {
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
                course.createCourseError =
                  zCreateCourseErrors.Enum.noEmailAccess;
                continue;
              }

              const enrollmentJson = await enrollmentResponse.json();
              console.log(enrollmentJson);
              if (
                enrollmentJson &&
                enrollmentJson[0] &&
                enrollmentJson[0].user &&
                enrollmentJson[0].user.hasOwnProperty('email')
              ) {
                course.ableToCreateCourse = true;
              } else {
                course.ableToCreateCourse = false;
                course.createCourseError =
                  zCreateCourseErrors.Enum.noEmailAccess;
              }
            } catch (error) {
              console.error(
                `Failed to fetch enrollments for course ${course.id} from Canvas: ${error}`
              );
            }
          }

          const matchingCoursesLMSIds = await prisma.course.findMany({
            where: {
              lmsId: {
                in: courses.map((course) => course.id.toString())
              }
            },
            select: {
              lmsId: true
            }
          });

          matchingCoursesLMSIds.forEach((matchingCourse) => {
            const courseToUpdate = courses.find(
              (course) => course.id.toString() === matchingCourse.lmsId
            );
            if (courseToUpdate) {
              courseToUpdate.ableToCreateCourse = false;
              courseToUpdate.createCourseError =
                zCreateCourseErrors.Enum.duplicate;
            }
          });

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
                ableToCreateCourse: course.ableToCreateCourse,
                createCourseError: course.createCourseError
              };
            }
          );

          return {
            success: true,
            courseList: convertedCourses
          };
        } catch (error) {
          throw new Error(`Failed to parse courses from Canvas: ${error}`);
        }
      } catch (error) {
        throw new Error(`Failed to fetch courses from Canvas: ${error}`);
      }
    })
});

export type CanvasCoursesRouter = typeof canvasRouter;
