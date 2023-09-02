'use client';
import { useGlobalContext } from '@/app/course-context';

const Page = () => {
  const data = useGlobalContext();

  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
export {};
