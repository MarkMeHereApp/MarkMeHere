import React, { lazy, Suspense } from 'react';
import EnrollCourseMemberButton from './EnrollCourseMemberButton';

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
      <div className="border border-yellow-500 p-4">
        <p className="text-sm mb-4">
          These buttons only show up in development mode
        </p>
        <div className="flex flex-row space-x-4">
          <EnrollCourseMemberButton />
          <GenerateRandomCourseMember />
          <ShowCurrentCourseMembers />
          <DeleteAllStudents />
        </div>
      </div>
    </Suspense>
  ) : null;
};

export default CRUDButtons;
