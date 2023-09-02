import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter
});

export type AppRouter = typeof appRouter;
