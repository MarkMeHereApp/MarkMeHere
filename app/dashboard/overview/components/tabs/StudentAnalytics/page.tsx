'use client';

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
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons setStudents={setStudents} />
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
