'use client'
import { Card, CardTitle } from "@/components/ui/card"
import React, {  useEffect,useState,useRef, useMemo } from 'react';
import dynamic from "next/dynamic";
import VerifiactionLoader from "./verificationLoader";

const VerifiactionLoaderPage: React.FC<{ code?: string }> = ({ code }) =>{
    
    const Stars = dynamic(() => import('@/components/background/stars'), {
        ssr: false
      });

    return (
        <>
            <div className="absolute top-0 right-0 h-full w-full">
                <Stars></Stars>
            </div>
            <VerifiactionLoader code={code}></VerifiactionLoader>
        </>
        )
}

export default VerifiactionLoaderPage