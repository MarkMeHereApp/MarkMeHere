import { publicProcedure, router } from '../trpc';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const canvasRouter = router({
  // Define a procedure to fetch courses from Canvas
  getCanvasCourses: publicProcedure.query(async (requestData) => {
    // Ensure the API token and Canvas domain are provided
    if (!CANVAS_API_TOKEN || !CANVAS_DOMAIN) {
      throw new Error('Canvas API token and domain not provided');
    }

    // Make a request to the Canvas API to fetch courses
    const response = await fetch(`https://${CANVAS_DOMAIN}/api/v1/courses`, {
      headers: {
        Authorization: `Bearer ${CANVAS_API_TOKEN}`
      }
    });

    // Check for errors in the response
    if (!response.ok) {
      throw new Error(
        `Failed to fetch courses from Canvas: ${response.statusText}`
      );
    }
    // Parse the JSON response and return it
    console.log(response.json());
    return response.json();
  })
});

export type CanvasCoursesRouter = typeof canvasRouter;
