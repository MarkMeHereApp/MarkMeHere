import React, { useEffect, useState } from 'react'; // Import React
import {
  addRandomStudent,
  deleteAllStudents,
  getStudents
} from '@/app/api/students/clientRequests';

import AttendanceView from './AttendanceView';
import { Button } from '@/components/ui/button';
import { Student } from '@/utils/sharedTypes';

const StudentAnalytics = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsData = await getStudents();

      if (studentsData.length > 0) {
        setStudents(studentsData);
      } else {
        console.error('No user data received.');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setStudents([]);
    }
  };

  const handleGetStudentsClick = async () => {
    const studentsData = await getStudents();
    setStudents(studentsData);
  };

  const handleAddRandomStudentClick = async () => {
    const studentsData = await addRandomStudent();
    setStudents(studentsData);
  };

  const handleDeleteAllStudentsClick = async () => {
    const studentsData = await deleteAllStudents();
    studentsData && setStudents(studentsData);
  };

  return (
    <div className="container mx-auto py-10">
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
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
