'use client';

import { useContext, lazy } from 'react'; // Import React

import StudentCRUDButtons from '@/app/api/students/StudentCRUDButtons';
import { StudentDataContext } from '@/app/providers';

const AttendanceView = lazy(() => import('./AttendanceView'));

const StudentAnalytics = () => {
  const { students } = useContext(StudentDataContext);
  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      <AttendanceView students={students} />
    </div>
  );
};

export default StudentAnalytics;
