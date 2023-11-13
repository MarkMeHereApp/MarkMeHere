'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import VerifiactionLoader from './verificationLoader';
import { Card } from '@/components/ui/card';
const VerifiactionLoaderPage: React.FC<{
  code: string;
}> = ({ code }) => {
  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });

  return (
    <>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars />
      </div>
      <Card className=" min-w-[500px]  mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
        <VerifiactionLoader code={code} />
      </Card>
    </>
  );
};

export default VerifiactionLoaderPage;
