
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/generate-qr-code';
import { SyncCanvasAttendanceButton } from '@/utils/devUtilsComponents/SyncCanvasGrade';

export default function ManageAttendance() {




  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8  md:flex py-8 px-2 sm:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>

          <div className="flex items-center space-x-2">
            <SyncCanvasAttendanceButton />
 
              <StartScanningButton  />
          </div>
        </div>

        <DataTable columns={columns} />
      </div>
    </div>
  );
}
