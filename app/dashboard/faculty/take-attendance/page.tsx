'use client';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/user-nav';

export default function ManageAttendance() {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Attendance Management
          </h2>
          <div className="flex items-center space-x-2">
            <StartScanningButton />
          </div>
        </div>
        <DataTable columns={columns} />
      </div>
    </>
  );
}
