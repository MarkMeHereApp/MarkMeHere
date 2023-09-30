'use client';
import React, {  useState } from 'react';
import {Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

import InputTable from './inputTable';

const InputPage = () => {


  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });
  
  
  const [inputValue,setInputValue] = useState('')

  const router = useRouter(); 
  
  const submitCode = () => {
    console.log(inputValue)
    router.push(`/submit?qr=${inputValue}`)
  }
  


  const EroorQRCode = () => {
    
      return (
        <CardTitle className='text-3xl font-bold font-mono tracking-widest text-center mt-[10%] pb-10 text-red-800	'>
        Invalid QR Code, Scan Again
        <br></br> 
        or
        </CardTitle>
      );
    
  }

  

  return (     
    <>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars></Stars>
      </div>

     <CardTitle className='text-3xl font-bold font-mono tracking-widest text-center mt-[10%] pb-10 text-red-800	'>
        Invalid QR Code, Scan Again
        <br></br> 
        or
      </CardTitle>

      <InputTable></InputTable>        
              
      
    </>
              
               
                    
              
    
  );
};

export default InputPage;
