'use client';
import { ShowCurrentCourseMembers } from '@/components/devUtils/ShowCurrentCourseMembers';
import { useCourseContext } from '@/app/course-context';

const Page = () => {
  const data = useCourseContext();

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
      <ShowCurrentCourseMembers />
    </div>
  );
};

export default Page;
export {};
