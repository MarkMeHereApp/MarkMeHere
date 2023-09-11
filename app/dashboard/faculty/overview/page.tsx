'use client';

import { useCourseContext } from '@/app/course-context';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';
import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';

export default function ManageAttendance() {
  const { selectedCourseId } = useCourseContext();

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {selectedCourseId ? (
        <MarkMeHereClassAnimation />
      ) : (
        <CreateChooseCourseAnimation />
      )}
    </div>
  );
}
