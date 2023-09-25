'use client';
import React, { useState } from 'react';
import {Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import dynamic from 'next/dynamic';

const InputPage = () => {

  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });

  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    // set the inputCode as token param and valid it send it. 
    console.log("Code Submited " + inputValue)
    
    //if valid completed sucessfuly, redirect. Else{InputCode page}

    };

    
  

  return (
    <div className="relative min-h-screen">
          <div className="absolute top-0 right-0 h-full w-full">
            <Stars />
          </div>
          
          <div className='flex flex-col top-0 right-0 bottom-0 h-full w-full align-middle'>

              <Card className="h-[30%] w-[40%] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-10 flex flex-col items-center justify-between ">
                  <CardTitle className='text-3xl font-bold font-mono tracking-widest text-center'>
                    Enter the Code
                  </CardTitle>
                  <Input 
                            style={{
                                width:'40%',
                                textAlign:'center',
                                height:'35%',
                                fontSize: '35px'
                            }}
                            type="text" 
                            value={inputValue.toUpperCase()} 
                            onChange={event => setInputValue(event.target.value)} 
                  />
                  
                  <Button onClick={() => handleSubmit()} style={{width:'17%', height:'22%'}}>
                    <div>Submit</div>
                  </Button>

            </Card>
                    
          </div>
          
          {/* Insert your components here */}
          
      </div>
    
    
    
  );
};

export default InputPage;
