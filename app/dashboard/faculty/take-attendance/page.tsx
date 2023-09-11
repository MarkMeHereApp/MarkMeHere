'use client';

import CRUDButtons from '@/utils/devUtils/CRUDButtons';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/user-nav';
import { useCourseContext } from '@/app/course-context';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';

export default function ManageAttendance() {
  const { selectedCourseId } = useCourseContext();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Take Attendance</h2>
          {selectedCourseId && <StartScanningButton />}
        </div>
        {selectedCourseId ? (
          <>
            <CRUDButtons />
            <DataTable columns={columns} />
          </>
        ) : (
          <CreateChooseCourseAnimation />
        )}
      </div>
    </>
  );
}
