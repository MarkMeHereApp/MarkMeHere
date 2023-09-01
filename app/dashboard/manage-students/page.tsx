'use client';

import StudentCRUDButtons, {
  EnrollNewStudentButton
} from '@/app/api/students/StudentCRUDButtons';
import { columns } from './columns';
import DataTable from './DataTable';

const ManageStudents = () => {
  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      <EnrollNewStudentButton />
      <DataTable columns={columns} />
    </div>
  );
};

export default ManageStudents;
