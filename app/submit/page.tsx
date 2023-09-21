'use client';
import CodeInput from "./components/codeInput";
import React from "react";
import dynamic from 'next/dynamic';


const SubmitPage = () => {
  
  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });
  


  return (
    <div className="relative min-h-screen">
        <div className="absolute top-0 right-0 h-full w-full">
          <Stars />
        </div>

        <CodeInput></CodeInput>
        {/* Insert your components here */}
      
    </div>
  );
}

export default SubmitPage;
