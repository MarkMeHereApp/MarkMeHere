import React, { lazy, Suspense } from 'react';

const DeleteAllStudents = lazy(() => import('./DeleteAllStudentsButton'));
const GenerateRandomCourseMember = lazy(
  () => import('./GenerateRandomCourseMember')
);
const ShowCurrentCourseMembers = lazy(
  () => import('./ShowCurrentCourseMembers')
);

const isDevMode = process.env.NODE_ENV === 'development';

const CRUDButtons = () => {
  return isDevMode ? (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateRandomCourseMember />
      <ShowCurrentCourseMembers />
      <DeleteAllStudents />
    </Suspense>
  ) : null;
};

export default CRUDButtons;
