'use client';

import { firaSansLogo } from '@/utils/fonts';

export const NoLecture = () => {
  return (
    <div className="h-1/2 w-full mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="p-6 flex justify-center items-center space-y-4 pt-8 animate-in fade-in ease-in duration-1000 ">
        <span className={firaSansLogo.className}>
          <h2 className="text-3xl sm:text-4xl">
            Add course members to get started!
          </h2>
          <h2 className="mt-1 text-2xl">
            Analytics will appear here once you have attendance data.
          </h2>
        </span>
      </div>
    </div>
  );
};

export default NoLecture;
