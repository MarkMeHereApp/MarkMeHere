import React, { useEffect, useState } from 'react'; // Import React

import AttendanceView from './AttendanceView';
import { Student } from '@/utils/sharedTypes';
import StudentCRUDButtons from '@/app/api/students/StudentCRUDButtons';
import { getStudents } from '@/app/api/students/clientRequests';

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

  return (
    <div className="container mx-auto py-10">
      <StudentCRUDButtons setStudents={setStudents} />
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
