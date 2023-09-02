'use client';

import { lazy } from 'react'; // Import React

import StudentCRUDButtons from '@/components/devUtils/StudentCRUDButtons';

const AttendanceView = lazy(() => import('./AttendanceView'));

const StudentAnalytics = () => {
  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <StudentCRUDButtons />
      {/* <AttendanceView students={students} /> */}
    </div>
  );
};

export default StudentAnalytics;
