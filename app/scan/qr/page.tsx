'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter from next/router
import { trpc } from '@/app/_trpc/client';

export default function QR() {
  const [progress, setProgress] = React.useState(0);
  const [activeCode, setActiveCode] = React.useState('LOADING');
  const createQRMutator = trpc.qr.CreateNewQRCode.useMutation();
  const timerUpdateRate = 100; // This is how long it takes for the slider to refresh its state ms, the higher the better the performance, but uglier the animation.
  const progressbarLength = 100; // The length of the progress bar in ms
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const mode =
    searchParams && searchParams.get('mode')
      ? searchParams.get('mode')
      : 'default';

  const [Stars, setStars] = React.useState<React.ComponentType | null>(null);
  const [DynamicQRCode, setDynamicQRCode] = React.useState<React.ComponentType<{
    url: string;
  }> | null>(null);

  React.useEffect(() => {
    if (mode === 'minimal') {
      //Because the minimal QR code changes sizes depending on the view port we can't have it render on the server at all, if we don't do this it tries to cache the QR code on the server.
      const QRCodeComponent = dynamic(
        () => import('./DynamicQRCodeComponent'),
        {
          ssr: false
        }
      );
      setDynamicQRCode(() => QRCodeComponent);
    } else {
      const DynamicStars = dynamic(
        () => import('@/components/background/stars'),
        {
          ssr: false
        }
      );
      setStars(() => DynamicStars);
    }
  }, [mode]);

  const bufferCodeRef = React.useRef('LOADING'); //code in buffer
  const activeCodeRef = React.useRef('LOADING'); // Active code reference

  const saveCode = async () => {
    try {
      const newBufferCode = await createQRMutator.mutateAsync({
        activeCodeToSave: activeCodeRef.current
      });

      if (newBufferCode.success) {
        bufferCodeRef.current = newBufferCode.qrCode.code;
      }
    } catch (error) {
      throw new Error('Unexpected server error.');
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (
          (oldProgress < 100 && bufferCodeRef.current === 'LOADING') ||
          activeCodeRef.current === 'LOADING'
        ) {
          setProgress(100);
        }
        if (oldProgress >= 100) {
          if (activeCodeRef.current !== bufferCodeRef.current) {
            setProgress(0); // Reset progress to 0 once it reaches 100
            setActiveCode(bufferCodeRef.current);
            activeCodeRef.current = bufferCodeRef.current;
          } else {
            setActiveCode('LOADING');
            activeCodeRef.current = 'LOADING';
          }

          saveCode();
          console.log('Saved code');
        }

        const newProgress = oldProgress + timerUpdateRate / progressbarLength; // Increase progress by timerLength / timerUpdateRate each step
        return newProgress;
      });
    }, timerUpdateRate); // 100ms * 50 steps = 5 seconds
    return () => clearInterval(timer);
  }, []);

  if (mode === 'minimal') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {DynamicQRCode && (
            <DynamicQRCode
              url={process.env.NEXTAUTH_URL + '/submit/' + activeCode}
            />
          )}
        </div>

        <Progress
          value={progress}
          className="w-[100%]"
          style={{ visibility: 'hidden' }}
        />
      </>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 right-0 h-full w-full">
        {Stars && <Stars />}
      </div>

      <Card className="h-full w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col items-center justify-between space-y-4">
        <CardHeader className="flex items-center justify-between hidden lg:block">
          <CardTitle className="font-bold pr-8">
            Scan the QR code with your phone to sign in
          </CardTitle>
          <Button onClick={() => router.push('/dashboard/take-attendance')}>
            <div>Finish</div>
          </Button>
        </CardHeader>

        <CardContent className="flex-grow flex-shrink flex flex-col items-center justify-between ">
          {activeCode === 'LOADING' ? (
            <div> </div>
          ) : (
            <QRCode
              value={process.env.NEXTAUTH_URL + '/submit/' + activeCode}
              className="h-full w-full"
            />
          )}

          <div className="flex flex-col items-center justify-center text-xl space-y-2 hidden lg:block">
            <span>Or go to the website and enter the code</span>
            <div className="flex flex-col items-center justify-center text-xl break-all">
              attendify.rickleincker.com/submit
            </div>
            <div className="pt-5">
              <Progress value={progress} className="w-[100%]" />
            </div>

            <Card className="flex justify-center items-center p">
              <CardHeader>
                <CardTitle className="text-5xl font-bold font-mono tracking-widest text-center">
                  {activeCode}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
