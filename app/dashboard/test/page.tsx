'use client';
import { useCourseContext } from '@/app/course-context';

const Page = () => {
  const data = useCourseContext();

  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
export {};
