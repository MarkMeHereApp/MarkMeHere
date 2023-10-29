'use client';

import { firaSansFont } from '@/utils/fonts';
import { Icons } from '@/components/ui/icons';
import CreateCourseForm from '@/app/(dashboard)/[organizationCode]/components/course-creation/class-creation-form';

export const NoCourse = () => {
  return (
    <div className="h-1/2 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
      <div className="flex items-center pb-6">
        <div className={firaSansFont.className + ' text-center mb-4 ml-4'}>
          <h2 className="text-4xl font-bold">Your Almost There!</h2>
          <h2 className="mt-1 text-2xl font-bold">
            Create your first course to start using the app.
          </h2>
        </div>
      </div>
      <CreateCourseForm onSuccess={() => {}} />
    </div>
  );
};

export default NoCourse;
