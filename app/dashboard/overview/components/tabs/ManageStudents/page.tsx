'use client';

import React, { useEffect, useState } from 'react';
import {
  addRandomStudent,
  deleteAllStudents,
  getStudents
} from '@/app/api/students/clientRequests';

import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { Student } from '@/utils/sharedTypes';
import { columns } from './columns';

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

  const handleGetStudentsClick = async () => {
    const studentsData = await getStudents();
    setData(studentsData);
  };

  const handleAddRandomStudentClick = async () => {
    const studentsData = await addRandomStudent();
    setData(studentsData);
  };

  const handleDeleteAllStudentsClick = async () => {
    const studentsData = await deleteAllStudents();
    studentsData && setData(studentsData);
  };

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-row gap-2">
            <Button
              variant="ghost"
              className="text-sm font-medium text-foreground transition-colors hover:text-background border-2"
              onClick={() => handleGetStudentsClick()}
            >
              Get Students
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium text-foreground transition-colors hover:text-background border-2"
              onClick={() => handleAddRandomStudentClick()}
            >
              + Add Random Student to DB +
            </Button>
            <Button
              variant="destructive"
              className="text-sm font-medium text-foreground transition-colors hover:text-background border-2"
              onClick={handleDeleteAllStudentsClick}
            >
              Delete All Students
            </Button>
          </div>
          <DataTable columns={columns} data={data} />
        </>
      )}
    </div>
  );
};

export default ManageStudents;
