"use client"

import Stars from '@/components/background/stars';
import React from "react";
import QRCode from "react-qr-code";
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Import useRouter from next/router

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

//Because the minimal QR code changes sizes depending on the view port we can't have it render on the server
const QRCodeComponent = dynamic(() => import('./DynamicQRCodeComponent'), { ssr: false });

export default function QR() {

  const [progress, setProgress] = React.useState(0);
  const [code, setCode] = React.useState(generateCode()); // Initialize code
  const timerUpdateRate = 100;  // This is how long it takes for the slider to refresh its state ms, the higher the better the performance, but uglier the animation.
  const progressbarLength = 50;       // The length of the progress bar in ms
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const mode = searchParams && searchParams.get('mode') ? searchParams.get('mode') : 'default';
 
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          setProgress(0); // Reset progress to 0 once it reaches 100
          setCode(generateCode()); // Generate a new code when progress reaches 100
          return 0;
        }
        const newProgress = oldProgress  + (timerUpdateRate / progressbarLength); // Increase progress by timerLength / timerUpdateRate each step
        return newProgress;
      });
    }, timerUpdateRate); // 100ms * 50 steps = 5 seconds
    return () => clearInterval(timer);
  }, []);

  

  if (mode === 'minimal') {
    
      return (
        <>
    
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <QRCodeComponent url={process.env.NEXTAUTH_URL + '/submit/' + code} />
          </div>
      
          <Progress value={progress} className="w-[100%]" style={{ visibility: "hidden" }} />

        </>
      );
  }

  return (
    <>
      <div className="relative h-screen">
        <div className="absolute top-0 right-0 h-full w-full">
          <Stars />
        </div>
        <Card className="w-[600px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 overflow-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-8 pb-2">
            <CardTitle className="text-lg font-bold pr-8">
              Scan the QR code with your phone to sign in
            </CardTitle>
            <Button onClick={() => router.push('/dashboard/take-attendance')}>
              <div className="text-lg ">
                Finish
              </div>
            </Button>
          </CardHeader>
            
            <CardContent>


              <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={process.env.NEXTAUTH_URL + '/submit/' + code}
              viewBox={`0 0 256 256`}
              className="flex flex-col items-center justify-center text-2xl mb-4"
              />
              
              {mode !== 'hide-code' && (
                <>
                  <div className="flex flex-col items-center justify-center text-2xl mb-4">
                    <span>Or go to the website and enter the code</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-2xl mb-8" style={{ wordBreak: 'break-all' }}>
                    attendify.rickleincker.com/submit
                  </div>

                  <CardFooter className="flex justify-between">
                    <Card className="w-[600px] mx-auto  h-full">
                      <CardHeader>
                        <CardTitle className="text-6xl font-bold">
                          {code}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </CardFooter>
                </>
              )}

            </CardContent>

            <Progress value={progress} className="w-[100%]" />
        </Card>

      </div>
    </>
  );
}
