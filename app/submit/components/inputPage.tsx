'use client';
import React, {  useEffect,useState } from 'react';
import {Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'components/ui/use-toast';
import InputTable from './inputTable';


const InputPage: React.FC = () => {

  const router = useRouter();

  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  }); 
    
  return (     
    <>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars></Stars>
      </div>
      <InputTable></InputTable>         
    </>                   
    
  );
};

export default InputPage;
