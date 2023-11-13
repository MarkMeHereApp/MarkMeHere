'use client';
import { Card, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loading from '@/components/general/loading';
import { ProfessorLectureGeolocation } from '@prisma/client';

import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import {
  addGeolocationToAttendanceToken,
  getProfessorGeolocationInfo
} from '@/data/attendance/attendance-token';
import GoogleMapsComponent from './googleMapsComponent';

// //Checking Geolocation
// const CheckGeolocation = async () => {
//   setIsLoadingSubmit(true);

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         studentLatitude.current = position.coords.latitude;
//         studentLongitude.current = position.coords.longitude;
//         await ValidateGeolocation(); // Call ValidateGeolocation after getting geolocation - Thats where the backend is called
//       },
//       (error) => {
//         if (error.code === error.PERMISSION_DENIED) {
//           // if the user did not allow the location
//           displayWarning(WarningType.DisabledLocation, null);
//         }

//         if (error.code === error.POSITION_UNAVAILABLE) {
//           displayWarning(WarningType.LocationUnavailable, null); // if the position is not available for any reason
//         }
//       }
//     );
//   } else {
//     new Error(
//       'There might be an issue with your browser, please scan and try to verify again!'
//     );
//   }
// };

// const validateGeolocation =
//   trpc.attendanceToken.ValidateGeolocation.useMutation();
// const ValidateGeolocation = async () => {
//   if (code) {
//     try {
//       const res = await validateGeolocation.mutateAsync({
//         id: code,
//         studentLatitude: studentLatitude.current,
//         studentLongtitude: studentLongitude.current
//       });

//       if (res.success && code == res.id) {
//         //assigning the response to the local value
//         professorLatitude.current = res.lectureLatitude;
//         professorLongitude.current = res.lectureLongtitude;

//         if (res.distance) {
//           // here we can add how far does the professor allow the students to be

//           //rounding to two decimal nums
//           const distanceRounded = parseFloat(res.distance.toFixed(2));
//           const lectureRange = res.lectureRange;

//           console.log(lectureRange);
//           //if distance is more than allowed range
//           if (distanceRounded > lectureRange) {
//             rangeValidator.current = false;
//             setProceedButtonText('Unverified');
//             displayWarning(WarningType.InvalidLocation, distanceRounded);
//           }

//           //if distance is less or equal to allowed range
//           if (distanceRounded <= lectureRange) {
//             rangeValidator.current = true;
//             setProceedButtonText('Verified');
//             displayWarning(WarningType.ValidLocation, distanceRounded);
//           }
//           range.current = distanceRounded;
//         }
//       }

//       if (!res.success) {
//         displayWarning(WarningType.DefaultError, null);
//         rangeValidator.current = false;
//       }
//     } catch (error) {
//       displayWarning(WarningType.DefaultError, null);
//     } finally {
//       setIsLoadingSubmit(false);
//     }
//   }
// };

const VerifiactionLoader = ({ code }: { code: string }) => {
  const router = useRouter();
  const { currentCourseUrl } = useCourseContext();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [gettingLocation, setGettingLocation] = useState(true);
  const [professorLectureGeolocation, setProfessorLectureGeolocation] =
    useState<ProfessorLectureGeolocation | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const submitWithoutVerification = async () => {
    setButtonLoading(true);
    router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`);
  };

  const SubmitWithoutVerificationComp = () => {
    return (
      <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
        <AreYouSureDialog
          title="Are you sure you want to continue without verification?"
          bDestructive={true}
          onConfirm={submitWithoutVerification}
        >
          <Button
            className="flex w-full"
            onClick={() => {}}
            variant={'destructive'}
            disabled={buttonLoading}
          >
            {buttonLoading ? <Loading /> : 'Continue Without Verification'}
          </Button>
        </AreYouSureDialog>
      </div>
    );
  };

  const getLocation = async () => {
    try {
      setButtonLoading(true);
      setGettingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          if (!lat || !long) {
            setLatitude(null);
            setLongitude(null);
            setGettingLocation(false);
          }

          const { attendanceToken, distance } =
            await getProfessorGeolocationInfo({
              attendanceTokenId: code,
              studentLatitude: lat,
              studentLongitude: long
            });
          if (!attendanceToken?.ProfessorLectureGeolocation) {
            submitWithoutVerification();
            return;
          }

          setDistance(distance);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setProfessorLectureGeolocation(
            attendanceToken.ProfessorLectureGeolocation
          );
          setGettingLocation(false);
          setButtonLoading(false);
        });
      }
    } catch (error) {
      setLatitude(null);
      setLongitude(null);
      setGettingLocation(false);
    }
  };

  const submitAttendance = async () => {
    console.log('asd');
    if (!latitude || !longitude) {
      console.log('asdasdasdasd');

      return;
    }

    setButtonLoading(true);
    try {
      const token = await addGeolocationToAttendanceToken({
        attendanceTokenId: code,
        latitude: latitude,
        longitude: longitude
      });
      router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`);
    } catch (error) {
      setLatitude(null);
      setLongitude(null);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (buttonLoading) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Location Verification</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
          <Loading name="Loading" />
        </div>
      </>
    );
  }

  if (gettingLocation) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Location Verification</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
          <Loading name="Grabbing Location Access" />
        </div>
      </>
    );
  }

  if ((!latitude || !longitude) && !gettingLocation) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Could Not Get Your Location!</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
          <Button
            className="flex w-full"
            onClick={() => {
              window.location.reload();
              setButtonLoading(true);
            }}
          >
            Try Again?
          </Button>
        </div>
        <SubmitWithoutVerificationComp />
      </>
    );
  }

  if (professorLectureGeolocation && longitude && latitude) {
    return (
      <>
        <>
          <CardTitle className="text-2xl font-bold  text-center">
            <span>Location Verification</span>
          </CardTitle>
          <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
            <GoogleMapsComponent
              studentLatitude={latitude}
              studentLongitude={longitude}
              professorLatitude={professorLectureGeolocation.lectureLatitude}
              professorLongitude={professorLectureGeolocation.lectureLongitude}
              professorRadius={professorLectureGeolocation.lectureRange}
            />
            <Button
              className="flex w-full"
              onClick={() => {
                submitAttendance();
              }}
              disabled={buttonLoading}
            >
              {distance}
            </Button>
          </div>
        </>
      </>
    );
  }

  return <></>;
};
export default VerifiactionLoader;
