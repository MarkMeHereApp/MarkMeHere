'use client';

import React, { useContext } from 'react';

import { DataTable } from './data-table';
import StudentCRUDButtons from '@/app/api/students/StudentCRUDButtons';
import { StudentDataContext } from '@/app/providers';
import { columns } from './columns';

const ManageStudents = () => {
  const { students } = useContext(StudentDataContext);

  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      <DataTable columns={columns} data={students} />
    </div>
  );
};

export default ManageStudents;
