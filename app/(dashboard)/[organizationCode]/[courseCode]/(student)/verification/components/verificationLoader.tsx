'use client';
import { Card, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loading from '@/components/general/loading';
import { ProfessorLectureGeolocation } from '@prisma/client';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { getProfessorGeolocationInfo } from '@/data/attendance/attendance-token';
import { addGeolocationToAttendanceToken } from '@/data/geolocation/mutation/add-geolocation-to-attendance-token';
import GoogleMapsComponent from './googleMapsComponent';
import { ReloadIcon } from '@radix-ui/react-icons';

const VerifiactionLoader = ({ code }: { code: string }) => {
  const router = useRouter();
  const { currentCourseUrl } = useCourseContext();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [studentLongitude, setLongitude] = useState<number | null>(null);
  const [studentLatitude, setLatitude] = useState<number | null>(null);
  const [gettingLocation, setGettingLocation] = useState(true);
  const [professorLectureGeolocation, setProfessorLectureGeolocation] =
    useState<ProfessorLectureGeolocation | null>(null);
  const [professorRadius, setProfessorRadius] = useState<number | null>(null);

  const submitCode = async () => {
    setButtonLoading(true);
    router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`);
  };

  const noLocation = () => {
    setButtonLoading(false);
    setGettingLocation(false);
    setLatitude(null);
    setLongitude(null);
    setProfessorRadius(null);
    setProfessorLectureGeolocation(null);
  };

  const getLocation = async () => {
    try {
      setButtonLoading(true);
      setGettingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            if (!lat || !long) {
              noLocation();
              return;
            }

            const { attendanceToken, distance } =
              await getProfessorGeolocationInfo({
                attendanceTokenId: code,
                studentLatitude: lat,
                studentLongitude: long
              });
            if (!attendanceToken?.ProfessorLectureGeolocation) {
              submitCode();
              return;
            }

            setProfessorRadius(distance);
            setLatitude(lat);
            setLongitude(long);
            setProfessorLectureGeolocation(
              attendanceToken.ProfessorLectureGeolocation
            );
            setGettingLocation(false);
            setButtonLoading(false);
          },
          (error) => {
            noLocation();
            return;
          }
        );
      }
    } catch (error) {
      noLocation();
    }
  };

  const submitAttendance = async () => {
    if (!studentLatitude || !studentLongitude) {
      submitCode();
      return;
    }

    setButtonLoading(true);
    try {
      await addGeolocationToAttendanceToken({
        attendanceTokenId: code,
        latitude: studentLatitude,
        longitude: studentLongitude
      });
      submitCode();
    } catch (error) {
      setLatitude(null);
      setLongitude(null);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const SubmitWithoutVerificationComp = () => {
    let buttonText = 'Submit Without Verification';
    let title = 'Are you sure you want to continue without verification?';
    let DescriptionComponent = () => {
      return (
        <div>
          <p>
            Your teacher will know that you have submitted your attendance
            without verification.
          </p>
        </div>
      );
    };
    if (studentLatitude && studentLongitude) {
      buttonText = 'Submit Out-Of-Range Attendance';
      title = 'Are you sure you want to submit your attendance?';
      DescriptionComponent = () => {
        return (
          <div>
            <p>
              Your teacher will know that you are out of range, but they will be
              able to know the location you submitted.
            </p>
          </div>
        );
      };
    }

    return (
      <div className="gap-4 flex flex-col items-center w-[100%]">
        <AreYouSureDialog
          title={title}
          bDestructive={true}
          onConfirm={submitAttendance}
          AlertDescriptionComponent={DescriptionComponent}
        >
          <Button
            className="flex w-full"
            onClick={() => {}}
            variant={'destructive'}
          >
            {buttonLoading ? <Loading /> : buttonText}
          </Button>
        </AreYouSureDialog>
      </div>
    );
  };

  if (buttonLoading) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Loading</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%] h-[400px] justify-center">
          <ReloadIcon
            className="animate-spin "
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      </>
    );
  }

  if (gettingLocation) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Getting Your Location</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%] h-[400px] justify-center">
          <ReloadIcon
            className="animate-spin "
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      </>
    );
  }

  if (
    professorLectureGeolocation &&
    studentLongitude !== null &&
    studentLatitude !== null &&
    professorRadius !== null &&
    professorRadius <= professorLectureGeolocation.lectureRange
  ) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>You Are In Range!</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
          <GoogleMapsComponent
            studentLatitude={studentLatitude}
            studentLongitude={studentLongitude}
            professorLatitude={professorLectureGeolocation.lectureLatitude}
            professorLongitude={professorLectureGeolocation.lectureLongitude}
            professorRadius={professorLectureGeolocation.lectureRange}
          />

          <Button
            className="flex w-full"
            onClick={() => {
              submitAttendance();
            }}
          >
            Submit Attendance
          </Button>
        </div>
      </>
    );
  }

  if (
    professorLectureGeolocation &&
    studentLongitude !== null &&
    studentLatitude !== null &&
    professorRadius !== null &&
    professorRadius > professorLectureGeolocation.lectureRange
  ) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>You are out of range!</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
          Please make sure you have disabled any VPNs or location spoofing.
          <GoogleMapsComponent
            studentLatitude={studentLatitude}
            studentLongitude={studentLongitude}
            professorLatitude={professorLectureGeolocation.lectureLatitude}
            professorLongitude={professorLectureGeolocation.lectureLongitude}
            professorRadius={professorLectureGeolocation.lectureRange}
          />
          <Button
            className="flex w-full"
            onClick={() => {
              window.location.reload();
              setButtonLoading(true);
            }}
          >
            Try Again?
          </Button>
          <SubmitWithoutVerificationComp />
        </div>
      </>
    );
  }

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
        <SubmitWithoutVerificationComp />
      </div>
    </>
  );
};
export default VerifiactionLoader;
