import { canvasRouter } from './routes/canvas';
import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';
import { userRouter } from './routes/user';
import { qrRouter } from './routes/qr';
import { lectureRouter } from './routes/lecture';
import { attendanceRouter } from './routes/attendance';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter,
  user: userRouter,
  qr: qrRouter,
  lecture: lectureRouter,
  attendance: attendanceRouter,
  canvas: canvasRouter
});

export type AppRouter = typeof appRouter;
