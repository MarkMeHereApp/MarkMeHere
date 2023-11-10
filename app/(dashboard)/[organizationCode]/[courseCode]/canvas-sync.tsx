import { Toast } from '@/components/general/toast';
import { toast } from '@/components/ui/use-toast';
import {
  syncCanvasCourseMembers,
  syncCanvasCourseAttendance
} from '@/data/canvas';
import { Suspense } from 'react';
const id = 'canvas-toast';

const Sync = async ({ courseCode }: { courseCode: string }) => {
  try {
    const numUpdated = await syncCanvasCourseMembers(courseCode);
    const attendanceUpdated = await syncCanvasCourseAttendance(courseCode);
    return (
      <Toast
        type="success"
        text={`Synced ${(
          numUpdated.numberCreated + numUpdated.numberUpdated
        ).toString()} Members`}
      />
    );
  } catch (e) {
    return <Toast type="error" text={'There was an error syncing with Canv'} />;
  }
};

export const CanvasSync = async ({ courseCode }: { courseCode: string }) => {
  return (
    <Suspense>
      <Sync courseCode={courseCode} />
    </Suspense>
  );
};
