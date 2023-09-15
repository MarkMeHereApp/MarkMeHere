import { lazy, Suspense } from 'react';
import isDevMode from '../isDevMode';
import GenerateCourseAsProfessor from './GeneratePopulatedComponents/GenerateCourseAsProfessor';

const EnrollCourseMemberButton = lazy(
  () => import('./EnrollCourseMemberButton')
);
const NukeDatabaseButton = lazy(() => import('./NukeDatabaseButton'));

const DeleteAllStudentsButton = lazy(() => import('./DeleteAllStudentsButton'));
const GenerateRandomCourseMember = lazy(
  () => import('./GenerateRandomCourseMember')
);
const ShowCurrentCourseMembers = lazy(
  () => import('./ShowCurrentCourseMembers')
);

const CRUDButtons = () => {
  return isDevMode ? (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="border border-yellow-500 p-4 my-4">
        <p className="text-sm mb-4">
          These buttons only show up in development mode. Run
          <code> npm run prod </code>
          instead to view the production version.
        </p>
        <div className="flex flex-row space-x-4">
          <EnrollCourseMemberButton />
          <GenerateRandomCourseMember />
          <ShowCurrentCourseMembers />
          <DeleteAllStudentsButton />
          <GenerateCourseAsProfessor />
          <NukeDatabaseButton />
        </div>
      </div>
    </Suspense>
  ) : null;
};

export default CRUDButtons;
