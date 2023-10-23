'use client';
import React, {  useEffect,useState,useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import InputTable from './inputTable';

const InputPage: React.FC = () => {


  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });
  
    
  return (     
    <>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars />
      </div>
      <InputTable></InputTable>
    </>                   
    
  );
};

export default InputPage;
