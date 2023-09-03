import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';
import { userRouter } from './routes/user';
import { qrRouter } from './routes/qr';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter,
  user: userRouter,
  qr: qrRouter
});

export type AppRouter = typeof appRouter;
