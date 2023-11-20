import { canvasRouter } from './routes/canvas';
import { router } from './trpc';

import { courseRouter } from './routes/course';
import { courseMemberRouter } from './routes/courseMember';
import { qrRouter } from './routes/qr';
import { recordQRAttendanceRouter } from './routes/recordQRAttendance';
import { lectureRouter } from './routes/lecture';
import { attendanceRouter } from './routes/attendance';
import { utilsRouter } from './routes/utils';
import { providerRouter } from './routes/provider';
import { organizationRouter } from './routes/organization';
import { userRouter } from './routes/user';
import { attendanceTokenRouter } from './routes/attendanceToken';
import { sessionlessRouter } from './routes/sessionless';

export const appRouter = router({
  course: courseRouter,
  courseMember: courseMemberRouter,
  qr: qrRouter,
  recordQRAttendance: recordQRAttendanceRouter,
  lecture: lectureRouter,
  attendance: attendanceRouter,
  canvas: canvasRouter,
  utils: utilsRouter,
  provider: providerRouter,
  user: userRouter,
  attendanceToken: attendanceTokenRouter,
  organization: organizationRouter,
  sessionless: sessionlessRouter
});

export type AppRouter = typeof appRouter;
