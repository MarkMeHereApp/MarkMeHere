'use client';

import React, { useEffect, useState } from 'react';

import CRUDButtons from '@/app/api/students/CRUDButtons';
import { DataTable } from './data-table';
import { Student } from '@/utils/sharedTypes';
import { columns } from './columns';
import { getStudents } from '@/app/api/students/clientRequests';

const ManageStudents = () => {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getStudents();
        setData(studentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CRUDButtons setStateAction={setData} />
          <DataTable columns={columns} data={data} />
        </>
      )}
    </div>
  );
};

export default ManageStudents;
