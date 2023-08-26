'use client';

import React, { useContext, useEffect } from 'react'; // Import React

import AttendanceView from './AttendanceView';
import StudentCRUDButtons from '@/app/api/students/StudentCRUDButtons';
import { StudentDataContext } from '@/app/providers';

const StudentAnalytics = () => {
  const { students, setStudents } = useContext(StudentDataContext);

  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
