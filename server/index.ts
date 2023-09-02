import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';
import { userRouter } from './routes/user';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;
