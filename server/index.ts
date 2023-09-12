import { canvasRouter } from './routes/canvas';
import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';
import { userRouter } from './routes/user';
import { qrRouter } from './routes/qr';
import { recordQRAttendanceRouter } from './routes/recordQRAttendance';
import { lectureRouter } from './routes/lecture';
import { attendanceRouter } from './routes/attendance';
import { utilsRouter } from './routes/utils';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter,
  user: userRouter,
  qr: qrRouter,
  recordQRAttendance: recordQRAttendanceRouter,
  lecture: lectureRouter,
  attendance: attendanceRouter,
  canvas: canvasRouter,
  utils: utilsRouter
});

export type AppRouter = typeof appRouter;
