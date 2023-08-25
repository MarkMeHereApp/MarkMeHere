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

  const handleAddRandomStudentClick = async () => {
    const studentsData = await addRandomStudent();
    setStudents(studentsData);
  };

  const handleDeleteAllStudentsClick = async () => {
    const studentsData = await deleteAllStudents();
    studentsData && setStudents(studentsData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 w-1/2">
        <Button onClick={() => fetchData()}>Get Students</Button>
        <Button
          variant="ghost"
          onClick={() => handleAddRandomStudentClick()}
          className="text-sm font-medium text-foreground transition-colors hover:text-background border-2"
        >
          + Add Random Student to DB +
        </Button>
        <Button onClick={handleDeleteAllStudentsClick}>
          Delete All Students
        </Button>
      </div>
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
