'use client';
import React from 'react';
import { useGlobalContext } from '@/app/dashboard/components/main-bar';

const Page = () => {
  const data = useGlobalContext();

  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
export {};
