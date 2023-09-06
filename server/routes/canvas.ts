import { publicProcedure, router } from '../trpc';
import z from 'zod';
// Import Prisma client
import { PrismaClient } from '@prisma/client';
import { zCanvasCourseSchema } from '@/types/sharedZodTypes';
const prisma = new PrismaClient();

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const canvasRouter = router({
  getCanvasCourses: publicProcedure
    .input(z.object({}))
    .query(async (requestData) => {
      if (!CANVAS_API_TOKEN || !CANVAS_DOMAIN) {
        throw new Error('Canvas API token and domain not provided');
      }
      try {
        const response = await fetch(
          `${CANVAS_DOMAIN}api/v1/courses?per_page=1000000&enrollment_state=active&include[]=email`,
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

          // We need to check if the user has access to user emails
          // If they don't, we can't allow them to create courses.
          const accessibleCourses = [];
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
                throw new Error(
                  `Failed to fetch enrollments for course ${course.id} from Canvas: ${enrollmentResponse.statusText}`
                );
              }

              const enrollmentJson = await enrollmentResponse.json();
              if (
                enrollmentJson &&
                enrollmentJson[0] &&
                enrollmentJson[0].user &&
                enrollmentJson[0].user.hasOwnProperty('email')
              ) {
                accessibleCourses.push(course.id);
              }
            } catch (error) {
              console.error(
                `Failed to fetch enrollments for course ${course.id} from Canvas: ${error}`
              );
            }
          }

          return {
            success: true,
            courseList: courses,
            alreadyCreatedCoures: matchingCoursesLMSIds,
            accessibleCourses: accessibleCourses
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
