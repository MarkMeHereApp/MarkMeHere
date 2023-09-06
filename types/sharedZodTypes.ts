import z from 'zod';

// Define the Zod schema for the course data
export const zCanvasCourseSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  course_code: z.string(),
  start_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  enrollments: z.array(z.object({ role: z.string() })).default([])
});
