import { publicProcedure, router } from '../trpc';
import z from 'zod';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

// Define the Zod schema for the course data
const zCourseSchema = z.object({
  id: z.number(),
  name: z.string(),
  course_code: z.string(),
  start_at: z.string().nullable(),
  end_at: z.string().nullable(),
  enrollments: z.array(z.object({ role: z.string() })).default([])
});

// We have to export the schema type here.
export type CourseType = z.infer<typeof zCourseSchema>;

export const canvasRouter = router({
  getCanvasCourses: publicProcedure
    .input(z.object({}))
    .query(async (requestData) => {
      if (!CANVAS_API_TOKEN || !CANVAS_DOMAIN) {
        throw new Error('Canvas API token and domain not provided');
      }
      try {
        const response = await fetch(
          `${CANVAS_DOMAIN}api/v1/courses?per_page=1000000&enrollment_state=active`,
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
          const courses: CourseType[] = json.map((course: any) =>
            zCourseSchema.parse(course)
          );

          return { success: true, courseList: courses };
        } catch (error) {
          throw new Error(`Failed to parse courses from Canvas: ${error}`);
        }
      } catch (error) {
        throw new Error(`Failed to fetch courses from Canvas: ${error}`);
      }
    })
});

export type CanvasCoursesRouter = typeof canvasRouter;
