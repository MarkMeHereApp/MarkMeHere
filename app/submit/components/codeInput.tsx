'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import {Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter from next/router

import dynamic from 'next/dynamic';

const CodeInput = () => {

  const router = useRouter(); // Initialize useRouter


  

  const [inputCode, setInputCode] = useState("");

  const handleSubmit = () => {
    
    console.log("Code Submited")
  };

  return (

    
    <div className='flex flex-col top-0 right-0 bottom-0 h-full w-full align-middle'>
        
        <Card className="h-[30%] w-[45%] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-10 flex flex-col items-center justify-between ">
          <CardTitle className='text-3xl font-bold font-mono tracking-widest text-center'>
            Enter the Code
          </CardTitle>
          <Input 
                    style={{
                        width:'50%',
                        textAlign:'center',
                        height:'25%'
                    }}
                    type="text" 
                    value={inputCode} 
                    onChange={e => setInputCode(e.target.value)} 
          />
          
          <Button onClick={() => router.push('/take-attendance')}>
            <div>Submit</div>
          </Button>

        </Card>        
    </div>
    
  );
};

export default CodeInput;
