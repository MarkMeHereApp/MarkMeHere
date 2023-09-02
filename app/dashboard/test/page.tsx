'use client';
import { useCourseContext } from '@/app/course-context';

const Page = () => {
  const data = useCourseContext();

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
    </div>
  );
};

export default Page;
export {};
