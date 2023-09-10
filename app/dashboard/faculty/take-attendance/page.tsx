'use client';

import CRUDButtons from '@/components/devUtils/CRUDButtons';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/user-nav';
import { useCourseContext } from '@/app/course-context';
import { Icons } from '@/components/ui/icons';

export default function ManageAttendance() {
  const { selectedCourseId } = useCourseContext();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Attendance Management
          </h2>
          {selectedCourseId && <StartScanningButton />}
        </div>
        {selectedCourseId ? (
          <>
            <CRUDButtons />
            <DataTable columns={columns} />
          </>
        ) : (
          <div className="pt-8 flex justify-center items-center">
            <Icons.logo
              className="wave-infinite primary-foreground"
              style={{ width: '150px', height: 'auto' }}
            />
            <h3 className="text-3xl tracking-tight">Create/Choose a course!</h3>
          </div>
        )}
      </div>
    </>
  );
}
