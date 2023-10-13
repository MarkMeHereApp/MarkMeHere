'use client';
import React from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import InputTable from './inputTable';

const InputPage: React.FC = () => {
  const router = useRouter();

  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });

  return (
    <>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars />
      </div>
      <InputTable />
    </>
  );
};

export default InputPage;
