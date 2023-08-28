'use client';

import DataTable from './DataTable';
import StudentCRUDButtons from '@/app/api/students/StudentCRUDButtons';
import { columns } from './columns';

const ManageStudents = () => {
  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      <DataTable columns={columns} />
    </div>
  );
};

export default ManageStudents;
