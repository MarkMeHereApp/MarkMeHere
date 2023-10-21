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
import { geolocationRouter } from './routes/geolocation';
import { siteSettingsRouter } from './routes/siteSettings';

import { userRouter } from './routes/user';

import { attendanceTokenRouter } from './routes/attendanceToken';

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
  geolocation: geolocationRouter,
  user: userRouter,
  attendanceToken: attendanceTokenRouter,
  siteSettings: siteSettingsRouter
});

export type AppRouter = typeof appRouter;
