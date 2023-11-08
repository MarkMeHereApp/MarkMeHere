'use client';

import { firaSansLogo } from '@/utils/fonts';
import CreateCourseForm from '@/app/(dashboard)/[organizationCode]/components/course-creation/class-creation-form';
import UserNav from '../../[courseCode]/components/user-nav';
export const FirstCourseCreation = () => {
  'use client';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="pb-6 flex flex-row">
        <div className={firaSansLogo.className + ' text-center mb-4 ml-4'}>
          <h2 className="text-4xl font-bold">Your Almost There!</h2>
          <h2 className="mt-1 text-2xl font-bold">
            Create your first course to start using the app.
          </h2>
        </div>
        <span>
          <UserNav />
        </span>
      </div>
      <CreateCourseForm onSuccess={() => {}} />
    </div>
  );
};

export default FirstCourseCreation;
