'use client'
import { Card, CardTitle } from "@/components/ui/card"
import React, {  useEffect,useState,useRef, useMemo, use } from 'react';
import dynamic from "next/dynamic";
import VerifiactionLoader from "./verificationLoader";
import { useRouter } from "next/navigation";
const VerifiactionLoaderPage: React.FC<{ code?: string, orgCode?: string, courseCode?: string }> = ({ code, orgCode, courseCode }) =>{
    
    const Stars = dynamic(() => import('@/components/background/stars'), {
        ssr: false
      });

    const router = useRouter()

    //making robust check that if the previous attendanceToken check was not succesfull, we give them error and return them back to /submit
    if(!courseCode || !orgCode){
        router.push(`/submit?error=unknown`)
    }

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