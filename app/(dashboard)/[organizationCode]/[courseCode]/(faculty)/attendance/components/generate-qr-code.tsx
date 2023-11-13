'use client';

import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { CourseMember } from '@prisma/client';
import { getPublicUrl } from '@/utils/globalFunctions';
import Loading from '@/components/general/loading';
import GoogleMapComponentAttendance from './range-picker-component';
import { markAllUnmarkedAbsent } from '@/data/attendance/make-all-unmarked-absent';
import { PiQrCode } from 'react-icons/pi';
import { useLecturesContext } from '../../../context-lecture';

export function StartScanningButton() {
  const router = useRouter();
  const { courseMembersOfSelectedCourse, currentCourseUrl } =
    useCourseContext();
  const { lectures, selectedAttendanceDate } = useLecturesContext();
  const navigation = `${currentCourseUrl}/qr`;
  const professorGeolocationId = useRef('');
  const defaultParam = '?mode=default';
  const firstParam = Cookies.get('qrSettings') || defaultParam;

  const [parameters, setParameters] = useState(firstParam);

  const [enableGeolocation, setEnableGeolocation] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lectureLatitude = useRef<number>(0);
  const lectureLongitude = useRef<number>(0);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const session = useSession();
  const userName = session?.data?.user?.name || '';
  const userEmail = session.data?.user?.email;

  const [error, setError] = useState<Error | null>(null);

  const locationData = {
    professorLatitude: lectureLatitude.current,
    professorLongitude: lectureLongitude.current
  };
  const getCurrentLecture = () => {
    if (lectures && selectedAttendanceDate) {
      return lectures.find((lecture) => {
        return (
          lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
      });
    }
  };

  const currentLecture = getCurrentLecture();

  const handleGeolocationChange = async (newGeolocation: boolean) => {
    setEnableGeolocation(newGeolocation);
    if (newGeolocation) {
      setIsDialogOpen(true);
      await fetchGeolocation();
    }
  };

  const getCourseMember = () => {
    if (courseMembersOfSelectedCourse) {
      const selectedCourseMember: CourseMember | undefined =
        courseMembersOfSelectedCourse.find(
          (member) => member.email === userEmail
        );
      if (selectedCourseMember) {
        return selectedCourseMember;
      }
      return null;
    }
  };

  const getGeolocationData = () => {
    setIsLoadingSubmit(true);
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            lectureLatitude.current = latitude;
            lectureLongitude.current = longitude;

            resolve(true);
          },
          (error) => {
            console.error('Error occurred while getting geolocation', error);
            resolve(false);
          }
        );
      } else {
        resolve(false);
      }
    });
  };

  if (error) {
    throw error;
  }

  const createProfessorLectureGeolocation =
    trpc.geolocation.CreateProfessorLectureGeolocation.useMutation();

  const handleGenerateQRCode = async () => {
    setIsLoadingSubmit(true);
    const selectedCourseMember = getCourseMember();
    const selectedCourseMemberId = selectedCourseMember
      ? selectedCourseMember.id
      : undefined;

    try {
      if (!currentLecture) {
        setError(new Error('Could not finnd Lecutre'));
        return;
      }

      await markAllUnmarkedAbsent({ lectureId: currentLecture.id });

      if (enableGeolocation) {
        if (!selectedCourseMemberId) {
          return;
        }

        const res = await createProfessorLectureGeolocation.mutateAsync({
          lectureLatitude: lectureLatitude.current,
          lectureLongitude: lectureLongitude.current,
          lectureId: currentLecture.id,
          courseMemberId: selectedCourseMemberId,
          lectureRange: range
        });

        professorGeolocationId.current = res.id;

        router.push(
          navigation +
            parameters +
            '&location=' +
            professorGeolocationId.current
        );
      } else {
        router.push(navigation + parameters);
      }

      setIsLoadingSubmit(false);
    } catch (error) {
      setError(error as Error);
    }
  };

  const onNewQRSettings = (newSetting: string) => {
    setParameters(newSetting);
    Cookies.set('qrSettings', newSetting);
  };

  const [range, setRange] = useState(150);

  const handleRangeSettings = (newRange: number) => {
    setRange(newRange);
  };

  const handleDialogComponent = (dialogOpen: boolean) => {
    setIsDialogOpen(dialogOpen);
  };

  const fetchGeolocation = async () => {
    await getGeolocationData();
    setIsLoadingSubmit(false);
  };
  if (!currentLecture) {
    return <></>;
  }

  const GeolocationSettingsDialog = () => {
    if (enableGeolocation && !isLoadingSubmit) {
      return (
        <AlertDialogContent>
          <AlertDialogDescription>
            <GoogleMapComponentAttendance
              postitonsData={locationData}
              onRangeChange={handleRangeSettings}
              isDialogOpen={handleDialogComponent}
            ></GoogleMapComponentAttendance>
          </AlertDialogDescription>
        </AlertDialogContent>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            size="default"
            className="whitespace-nowrap"
          >
            <PiQrCode className="w-4 h-4" />
            <span className="hidden sm:flex ml-2">Create QR</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Display QR Code</AlertDialogTitle>
            <AlertDialogDescription>
              <RadioGroup
                defaultValue={
                  Cookies.get('qrSettings')
                    ? Cookies.get('qrSettings')
                    : defaultParam
                }
                className="p-4"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          onClick={() => onNewQRSettings('?mode=default')}
                          value="?mode=default"
                          id="r1"
                        />
                        <Label htmlFor="r1">Default</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        This option displays both a QR code and a manual entry
                        code for students without a phone/camera.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          onClick={() => onNewQRSettings('?mode=hide-code')}
                          value="?mode=hide-code"
                          id="r2"
                        />
                        <Label htmlFor="r2">Hide Code</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        This option only displays the QR code, concealing the
                        manual entry code that students could otherwise use.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          onClick={() => onNewQRSettings('?mode=minimal')}
                          value="?mode=minimal"
                          id="r3"
                        />
                        <Label htmlFor="r3">Minimal</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        This option displays only the QR code in a simplified
                        format. It&apos;s best suited for presentations footers
                        where distractions need to be minimized.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="mt-[10px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild></TooltipTrigger>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={enableGeolocation}
                          onCheckedChange={handleGeolocationChange}
                        />
                        <Label htmlFor="r3">Location Checker</Label>

                        <AlertDialog open={isDialogOpen}>
                          <GeolocationSettingsDialog />
                        </AlertDialog>
                      </div>

                      <TooltipContent>
                        <p>
                          This option displays only the QR code in a simplified
                          format. It&apos;s best suited for presentations
                          footers where distractions need to be minimized.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </RadioGroup>

              <div className="flex items-center space-x-2 pb-4 pl-4">
                Now you can display the QR code by clicking the button below
              </div>

              <div className="flex items-center space-x-2 pl-4">
                <Button
                  onClick={handleGenerateQRCode}
                  disabled={isLoadingSubmit}
                >
                  {isLoadingSubmit ? <Loading /> : 'Continue To QR Code'}
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
