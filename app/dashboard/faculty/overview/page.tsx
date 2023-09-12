'use client';

import { useCourseContext } from '@/app/course-context';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Stars from '@/components/background/stars';
import { firaSansFont } from '@/utils/fonts';
import { Icons } from '@/components/ui/icons';
import { useLecturesContext } from '../lecture-context';
import CRUDButtons from '@/utils/devUtilsComponents/CRUDButtons';
import isDevMode from '@/utils/isDevMode';

const OverviewAnalytics = dynamic(() => import('./analytics'));

export default function Overview() {
  const { selectedCourseId, userCourses } = useCourseContext();
  const { lectures } = useLecturesContext();
  const selectedCourseName = userCourses?.find((courses) => {
    return courses.id === selectedCourseId;
  })?.name;

  const session = useSession();
  const userName = session?.data?.user?.name || '';

  const WelcomePage = () => {
    return (
      <div className="relative h-full w-full">
        <Stars />
        <div className="h-1/2 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="p-6 flex justify-center items-center space-y-4 pt-8 animate-in fade-in ease-in duration-1000 ">
            <Icons.logo
              className="wave-infinite primary-foreground"
              style={{ width: '150px', height: 'auto' }}
            />
            <span className={firaSansFont.className}>
              <div className="flex-col">
                <h2 className="text-4xl font-bold">Welcome to Mark Me Here!</h2>
                <h2 className="text-2xl font-bold">
                  Create a course to get started.
                </h2>
              </div>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const NoLecturesDataPage = () => {
    return (
      <div className="h-1/2 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="p-6 flex justify-center items-center space-y-4 pt-8 animate-in fade-in ease-in duration-1000 ">
          <Icons.logo
            className="wave-infinite primary-foreground"
            style={{ width: '150px', height: 'auto' }}
          />
          <span className={firaSansFont.className}>
            <div className="flex-col">
              <h2 className="text-4xl font-bold">
                Add course members to get started!
              </h2>
              <h2 className="text-2xl font-bold">
                Analytics will appear here once you have attendance data.
              </h2>
            </div>
          </span>
        </div>
      </div>
    );
  };

  const OverviewAnalyticsPage = () => {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="block h-full flex-1 flex-col space-y-4 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {`Welcome to ${selectedCourseName},
              ${userName.substring(0, userName.indexOf(' '))}!`}
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-full space-y-2">
                {selectedCourseId && lectures && lectures.length > 0 ? (
                  <OverviewAnalytics />
                ) : (
                  <NoLecturesDataPage />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return selectedCourseId ? <OverviewAnalyticsPage /> : <WelcomePage />;
}
