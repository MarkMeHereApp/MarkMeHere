'use client';

import Cookies from 'js-cookie';
import { useState, useRef } from 'react';
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

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

import { useSession } from 'next-auth/react';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { CourseMember } from '@prisma/client';
import Loading from '@/components/general/loading';
import { markAllUnmarkedAbsent } from '@/data/attendance/make-all-unmarked-absent';
import { PiQrCode } from 'react-icons/pi';
import { useLecturesContext } from '../../../context-lecture';
import { createProfessorGeolocation } from '@/data/geolocation/mutation/create-professor-geolocation';

export type Geolocation = {
  longitude: number;
  latitude: number;
  radius: number;
};

import GetProfessorGeolocationData from './get-professor-geolocation-data';
export function StartScanningButton() {
  const router = useRouter();
  const { courseMembersOfSelectedCourse, currentCourseUrl } =
    useCourseContext();
  const { lectures, selectedAttendanceDate } = useLecturesContext();
  const navigation = `${currentCourseUrl}/qr`;
  const defaultParam = '?mode=default';
  const firstParam = Cookies.get('qrSettings') || defaultParam;

  const [parameters, setParameters] = useState(firstParam);

  const [professorGeolocation, setProfessorGeolocation] =
    useState<Geolocation | null>(null);
  const [geolocationDialogOpen, setGeolocationDialogOpen] =
    useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);

  const session = useSession();
  const userEmail = session.data?.user?.email;

  const [error, setError] = useState<Error | null>(null);

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

  if (error) {
    throw error;
  }

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

      if (professorGeolocation) {
        if (!selectedCourseMemberId) {
          setError(new Error("Couldn't find course member id"));
          return;
        }
        const res = await createProfessorGeolocation({
          lectureLatitude: professorGeolocation.latitude,
          lectureLongitude: professorGeolocation.longitude,
          lectureId: currentLecture.id,
          courseMemberId: selectedCourseMemberId,
          lectureRange: professorGeolocation.radius
        });
        router.push(navigation + parameters + '&location=' + res.id);
      } else {
        router.push(navigation + parameters);
      }
    } catch (error) {
      setError(error as Error);
    }
  };

  const onNewQRSettings = (newSetting: string) => {
    setParameters(newSetting);
    Cookies.set('qrSettings', newSetting);
  };

  if (!currentLecture) {
    return <></>;
  }

  const resetGeolocation = () => {
    setGeolocationDialogOpen(false);
    setProfessorGeolocation(null);
  };

  return (
    <div>
      <AlertDialog onOpenChange={resetGeolocation}>
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
              </RadioGroup>

              <div className="pl-4 pb-4 space-x-2 flex align-center">
                <Switch
                  checked={!!professorGeolocation}
                  onClick={() => {
                    if (!!professorGeolocation) {
                      setProfessorGeolocation(null);
                    } else {
                      setGeolocationDialogOpen(true);
                    }
                  }}
                />
                <span>
                  Geolocation{' '}
                  {professorGeolocation
                    ? ' configured at ' +
                      professorGeolocation.radius.toString() +
                      ' feet'
                    : ''}
                </span>
              </div>

              <Dialog
                open={geolocationDialogOpen}
                onOpenChange={setGeolocationDialogOpen}
              >
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <GetProfessorGeolocationData
                    setProfessorGeolocation={setProfessorGeolocation}
                    setDialogOpen={setGeolocationDialogOpen}
                  />
                </DialogContent>
              </Dialog>

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
