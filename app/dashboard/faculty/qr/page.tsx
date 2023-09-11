'use client';

//We need to pass the lectureid of the qr code into the database with qrcode. Then when
//we validate the qr code we can grab these values and use them when marking students

import React from 'react';
import QRCode from 'react-qr-code';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { qrcode } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter from next/router
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/course-context';
import { useLecturesContext } from '@/app/dashboard/faculty/lecture-context';

export default function QR() {
  const [progress, setProgress] = React.useState(0);
  const [activeCode, setActiveCode] = React.useState('LOADING');
  const createQRMutator = trpc.qr.CreateNewQRCode.useMutation();
  const expirationTime = 5; // This is how long the QR code will last in seconds
  const timerUpdateRate = 50; // This is how long it takes for the slider to refresh its state ms, the higher the better the performance, but uglier the animation.
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const {
    selectedAttendanceDate,
    courseMembersOfSelectedCourse,
    selectedCourseId
  } = useCourseContext();

  const { setLectures, lectures } = useLecturesContext();

  //Get the lecture currently active in the QR code(selected in the calendar)
  const getCurrentLecture = () => {
    if (lectures) {
      return lectures.find((lecture) => {
        return (
          lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
      });
    }
  };

  //Convert string | null type to string
  const courseId: string = selectedCourseId ?? '';
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

  const initialCode: qrcode = {
    id: 'LOADING',
    code: 'LOADING',
    courseId: 'LOADING',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3153600000000) // This will expire in 100 year, so it will never expire...
  };

  const bufferCodeRef = React.useRef(initialCode); //code in buffer
  const activeCodeRef = React.useRef(initialCode); // Active code reference
  const bIsFetchingInitCodes = React.useRef(false); // Is the code currently being fetched

  // This function will update the active code with the buffer code.
  // Then it will fetch a new buffer code asynchronously.
  // We do this so that we don't have to "wait" for a code to be fetched.
  const updateCodes = async () => {
    setActiveCode(bufferCodeRef.current.code);
    activeCodeRef.current = bufferCodeRef.current;
    try {
      const newBufferCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime * 2, // 5 seconds * 2 (to account for the buffer the buffer)
        courseId: courseId
      });

      if (newBufferCode.success) {
        bufferCodeRef.current = newBufferCode.qrCode;
      }
    } catch (error) {
      throw new Error('Unexpected server error.');
    }
  };

  // This function will initialize BOTH the buffer and active code at the same time
  // However, the codes might need to be initialized more than once (see useEffect) to see why...
  const initCodes = async () => {
    setActiveCode('LOADING');
    try {
      const newActiveCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime, // 5 seconds
        courseId: courseId
      });

      if (newActiveCode.success) {
        activeCodeRef.current = newActiveCode.qrCode;
      }
      setActiveCode(activeCodeRef.current.code);

      const newBufferCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime * 2, // 5 seconds * 2 (to account for the buffer the buffer)
        courseId: courseId
      });

      if (newBufferCode.success) {
        bufferCodeRef.current = newBufferCode.qrCode;
      }

      bIsFetchingInitCodes.current = false;
    } catch (error) {
      throw new Error('Unexpected server error.');
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // If the codes are loading for the first time, we want to "suspend" the progress bar.
        if (bIsFetchingInitCodes.current) {
          return 0;
        }

        // If the user is not on the page, reset the code.
        // Functionally this is not needed, the page will correct itself when they go back
        // but when the document is  hidden, the timer will run slower, so this is to prevent
        // UI weirdness.
        if (document.hidden) {
          bufferCodeRef.current = initialCode;
          activeCodeRef.current = initialCode;
          return 0;
        }

        // If the code is expired, reset the code
        if (activeCodeRef.current.expiresAt.getTime() <= Date.now()) {
          bufferCodeRef.current = initialCode;
          activeCodeRef.current = initialCode;
        }

        // This handles if the buffer code hasn't been initialized yet
        if (
          bufferCodeRef.current === initialCode &&
          !bIsFetchingInitCodes.current
        ) {
          bIsFetchingInitCodes.current = true;
          initCodes();
          return 0;
        }

        if (oldProgress >= 100) {
          setProgress(0);
          updateCodes();
        }

        const secondsLeft =
          (activeCodeRef.current.expiresAt.getTime() - Date.now()) / 1000;

        if (secondsLeft <= 0) {
          return 100;
        }

        const newProgress = oldProgress + timerUpdateRate / (secondsLeft * 10); // Increase progress by timerLength / timerUpdateRate each step
        return newProgress;
      });
    }, timerUpdateRate);
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
              url={
                process.env.NEXT_PUBLIC_BASE_URL +
                `/api/trpc/qr.ValidateQRCode?lectureId=${encodeURIComponent(
                  JSON.stringify(selectedCourseId)
                )}
                &qr=${encodeURIComponent(JSON.stringify(activeCode))}`
              }
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
              value={
                process.env.NEXT_PUBLIC_BASE_URL +
                `/api/trpc/qr.ValidateQRCode?lectureId=${encodeURIComponent(
                  JSON.stringify(selectedCourseId)
                )}
              &qr=${encodeURIComponent(JSON.stringify(activeCode))}`
              }
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
