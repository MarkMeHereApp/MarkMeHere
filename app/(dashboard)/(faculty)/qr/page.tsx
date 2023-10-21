'use client';

//We need to pass the lectureid of the qr code into the database with qrcode. Then when
//we validate the qr code we can grab these values and use them when marking students

import React from 'react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { qrcode } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter from next/router
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/context-course';
import { useLecturesContext } from '@/app/context-lecture';
import { ReloadIcon } from '@radix-ui/react-icons';
import QRCodeComponent from './DynamicQRCodeComponent';
import { qrCodeExpirationTime } from '@/utils/globalVariables';
import { Lecture, AttendanceEntry } from '@prisma/client';
import { getPublicUrl } from '@/utils/globalFunctions';

const QR = () => {
  const [progress, setProgress] = React.useState(0);
  const [activeCode, setActiveCode] = React.useState('LOADING');
  const createQRMutator = trpc.qr.CreateNewQRCode.useMutation();
  const expirationTime = qrCodeExpirationTime / 1000; // This is how long the QR code will last in seconds
  const timerUpdateRate = 50; // This is how long it takes for the slider to refresh its state ms, the higher the better the performance, but uglier the animation.
  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const { selectedAttendanceDate, userCourses, selectedCourseRole } =
    useCourseContext();
  const { lectures } = useLecturesContext();

  //Only Professors or TA's can access this page
  if (selectedCourseRole === 'student') {
    router.push(
      `/?qr-warning=${encodeURIComponent(
        'You must be a Professor or TA to generate QR codes for this course'
      )}`
    );
  }

  //Find the lecture currently active in the QR code (selected in the calendar)
  const getCurrentLecture = () => {
    if (lectures) {
      return lectures.find((lecture) => {
        return (
          lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
      });
    }
  };

  const getCurrentCourseName = () => {
    if (userCourses) {
      const course = userCourses.find((course) => {
        return course.id === getCurrentLecture()?.courseId;
      });

      if (course) {
        return course.name;
      }
      return undefined;
    }
  };

  const [currentCourseName, setCurrentCourseName] = React.useState<
    string | undefined
  >(getCurrentCourseName());
  const [currentLecture, setCurrentLecture] = React.useState<
    ({ attendanceEntries: AttendanceEntry[] } & Lecture) | undefined
  >(getCurrentLecture());

  const currentLectureRef = React.useRef(currentLecture); //Reference to the current lecture

  // This useEffect will run when the lectures change.
  React.useEffect(() => {
    if (!lectures) {
      setCurrentCourseName(undefined);
      setCurrentLecture(undefined);
      currentLectureRef.current = undefined;
      return;
    }

    const newLecture = getCurrentLecture();
    if (!newLecture) {
      const message = 'There is no lecture for selected date';
      const encodedMessage = encodeURIComponent(message);
      router.push(`/mark-attendance-status?qr-warning=${encodedMessage}`);
      return;
    }

    setCurrentCourseName(getCurrentCourseName());
    setCurrentLecture(newLecture);
    currentLectureRef.current = newLecture;
    initCodes();
  }, [lectures]);

  const mode =
    searchParams && searchParams.get('mode')
      ? searchParams.get('mode')
      : 'default';


  const locationId = searchParams && searchParams.get('location')
    ? searchParams.get('location')
    : false

  const [Stars, setStars] = React.useState<React.ComponentType | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [DynamicQRCode, setDynamicQRCode] = React.useState<React.ComponentType<{
    url: string;
  }> | null>(null);

  if (error) {
    throw error;
  }

  React.useEffect(() => {
    if (activeCode === 'LOADING') {
      // Insert your loader animation code here
    }
  }, [activeCode]);

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
    lectureId: 'LOADING',
    courseId: 'LOADING',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3153600000000), // This will expire in 100 year, so it will never expire...or will it ?
    ProfessorLectureGeolocationId: locationId || null 
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
      if (!currentLectureRef.current || !currentLectureRef.current.id) {
        setError(new Error('No lecture selected'));
        return;
      }
      const newBufferCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime * 2, // 5 seconds * 2 (to account for the buffer the buffer)
        lectureId: currentLectureRef.current.id,
        courseId: currentLectureRef.current.courseId,
        professorLectureGeolocationId: locationId || ''
      });
      if (!currentLectureRef.current) {
        return;
      }
      if (newBufferCode.success) {
        bufferCodeRef.current = newBufferCode.qrCode;
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  // This function will initialize BOTH the buffer and active code at the same time
  // However, the codes might need to be initialized more than once (see useEffect) to see why...
  const initCodes = async () => {
    try {
      setActiveCode('LOADING');
      bIsFetchingInitCodes.current = true;
      // If the lecture isn't valid, we must be loading the lecture
      if (!currentLectureRef.current) {
        return;
      }
      const lectureAtStartOfFunction = currentLectureRef.current;
      const newActiveCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime * 1.25, // * 1.25 to account for the initial fetch time
        lectureId: currentLectureRef.current.id,
        courseId: currentLectureRef.current.courseId,
        professorLectureGeolocationId: locationId || ''
      });

      // This happens if between the codes being initialized, the lecture was changed.
      if (lectureAtStartOfFunction !== currentLectureRef.current) {
        return;
      }

      const newBufferCode = await createQRMutator.mutateAsync({
        secondsToExpireNewCode: expirationTime * 2.5, //* 2.5 (to account for the buffer and the initial fetch time)
        lectureId: currentLectureRef.current.id,
        courseId: currentLectureRef.current.courseId,
        professorLectureGeolocationId: locationId || ''
      });

      // This happens if between the codes being initialized, the lecture was changed.
      if (lectureAtStartOfFunction !== currentLectureRef.current) {
        return;
      }

      if (newActiveCode.success && newBufferCode.success) {
        activeCodeRef.current = newActiveCode.qrCode;
        setActiveCode(activeCodeRef.current.code);
        bufferCodeRef.current = newBufferCode.qrCode;
        bIsFetchingInitCodes.current = false;
        return;
      }

      setError(new Error('Failed to initialize codes'));
    } catch (error) {
      setError(error as Error);
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // If the codes are loading for the first time, we want to "suspend" the progress bar.
        if (bIsFetchingInitCodes.current) {
          return 0;
        }

        // If the user is not on the page, reset the code
        if (document.hidden) {
          initCodes();
          return 0;
        }

        // If the code is expired, reset the code
        if (activeCodeRef.current.expiresAt.getTime() <= Date.now()) {
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

  const MinimalQRCodeDisplay = () => {
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
          {activeCode === 'LOADING' ? (
            <div>
              <ReloadIcon
                className="animate-spin "
                style={{ height: '100px', width: '100px' }}
              />
            </div>
          ) : (
            <div>
              {DynamicQRCode && (
                <DynamicQRCode
                  url={
                    getPublicUrl() +
                    `/submit?qr=${encodeURIComponent(activeCode)}`
                  }
                />
              )}
            </div>
          )}
        </div>

        <Progress
          value={progress}
          className="w-[100%]"
          style={{ visibility: 'hidden' }}
        />
      </>
    );
  };

  // Default QR Code
  // TODO:
  // - Stars Background
  // - Empty Card Fit to Stars
  // - Card Header with title and finish button
  // - QR Code (Finished with DynamicQRCodeComponent)
  // - Progress Bar (Finished with Progress Component)
  // - ManualCodeDisplay (Finished)
  // - Resize Progress Bar and ManualCodeDisplay relative to DynamicQRCodeComponent
  // - ???
  // - Profit

  const DefaultQRCodeDisplay = () => {
    const ProgressBarDisplay = () => {
      return <Progress value={progress} className="w-[35%]" />;
    };

    const ManualCodeDisplay = () => {
      return (
        <>
          <div className="text-center">
            <span>Scan or enter the code at:</span>
            <div className="flex flex-col items-center justify-center text-xl break-all">
              {`${getPublicUrl()}/submit`}
            </div>

            <CardHeader>
              <CardTitle className="text-5xl font-bold font-mono tracking-widest text-center">
                {activeCode}
              </CardTitle>
            </CardHeader>
          </div>
        </>
      );
    };

    return (
      <>
        <CardHeader>
          <CardTitle className="whitespace-nowrap overflow-ellipsis overflow-hidden max-w-lg text-3xl font-bold tracking-widest text-center ">
            {currentCourseName || '\u200B'}
          </CardTitle>
        </CardHeader>
        {activeCode === 'LOADING' ? (
          <div className="flex flex-col h-[100%] justify-center content-center">
            <ReloadIcon
              className="animate-spin "
              style={{ height: '100px', width: '100px' }}
            />
          </div>
        ) : (
          <QRCodeComponent
            url={
              getPublicUrl() + `/submit?qr=${encodeURIComponent(activeCode)}`
            }
          />
        )}
        {mode === 'default' && <ManualCodeDisplay />}
        <ProgressBarDisplay />
      </>
    );
  };

  if (mode === 'minimal') {
    return <MinimalQRCodeDisplay />;
  } else {
    return (
      <div className="relative min-h-screen">
        <div className="absolute top-0 right-0 h-full w-full">
          {Stars && <Stars />}
        </div>

        <Card className="h-full w-[55%] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col items-center justify-between space-y-4">
          <DefaultQRCodeDisplay />
          <Button onClick={() => router.push('/mark-attendance-status')}>
            <div>Finish</div>
          </Button>
        </Card>
      </div>
    );
  }
};

export default QR;
