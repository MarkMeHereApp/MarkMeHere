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
import { useCourseContext } from '@/app/context-course';
import { CourseMember } from '@prisma/client';
import { geolocationRouter } from '@/server/routes/geolocation';
import { getPublicUrl } from '@/utils/globalFunctions';

interface StartScanningButtonProps {
  lectureId: string; // or number, depending on what type lectureId is supposed to be
}

export function StartScanningButton({ lectureId }: StartScanningButtonProps) {
  const router = useRouter();

  const address = `${getPublicUrl()}`;
  const navigation = '/qr';

  const professorGeolocationId = useRef('')

  const [isCopied, setCopied] = useState(false);
  const [svgValue, setSvgValue] = useState(
    'M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z'
  );
  const defaultParam = '?mode=default';
  const firstParam = Cookies.get('qrSettings') || defaultParam;

  const [parameters, setParameters] = useState(firstParam);
  

  
  const [enableGeolocation, setEnableGeolocation] = useState<boolean>(true)
  
  const handleGeolocationChange = () => {
    setEnableGeolocation(!enableGeolocation);
    console.log(!enableGeolocation);
  };

  const lectureLatitude = useRef<number>(0)
  const lectureLongitude = useRef<number>(0)
  

  const session = useSession();
  const userName = session?.data?.user?.name || '';
  const userEmail = session.data?.user?.email;

  const { courseMembersOfSelectedCourse } = useCourseContext();

  const [selectCourseMember, setSelectCourseMember] = useState<
    CourseMember | undefined
  >();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isCopied) {
      setSvgValue(
        'M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z'
      );
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } else {
      setSvgValue(
        'M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z'
      );
    }
  }, [isCopied]);

  const getCourseMember = () => {
    console.log(courseMembersOfSelectedCourse);

    if (courseMembersOfSelectedCourse) {
      const selectedCourseMember: CourseMember | undefined =
        courseMembersOfSelectedCourse.find(
          (member) => member.email === userEmail
        );
      if (selectedCourseMember) {
        setSelectCourseMember(selectedCourseMember);
        return selectedCourseMember;
      }
      return null;
    }
  };

  const getGeolocationData = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
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
        console.log('Geolocation is not supported by this browser.');
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
    const selectedCourseMember = getCourseMember();
    const selectedCourseMemberId = selectedCourseMember
      ? selectedCourseMember.id
      : undefined;
    console.log(lectureId);
    console.log(selectedCourseMemberId);
    console.log(
      `Latitude: ${lectureLatitude.current}, Longitude: ${lectureLongitude.current} from the professor lecture before the fetch`
    );

    if (enableGeolocation) {
      const location = await getGeolocationData();
    }
    
    if(enableGeolocation){
      const location = await getGeolocationData()

      if(location){
        console.log(`Latitude: ${lectureLatitude.current}, Longitude: ${lectureLongitude.current} from the professor lecture during the fetch`);

        try{
  
          if(!selectedCourseMemberId){
            return 
          }

  
          const res = await createProfessorLectureGeolocation.mutateAsync({
            lectureLatitude: lectureLatitude.current,
            lectureLongitude: lectureLongitude.current,
            lectureId: lectureId,
            courseMemberId: selectedCourseMemberId
          })
          
          professorGeolocationId.current = res.id


          console.log(res)
        }catch (error) {
          console.log(error)
          // setError(error as Error);
        }finally{
          
          console.log(navigation + parameters + '&location=' + professorGeolocationId.current)
          router.push(navigation + parameters + '&location=' + professorGeolocationId.current)
        }
      } else {
        console.log('unable to locate');
      }
    }

    if (!enableGeolocation) {
      console.log('location is disabled');
      router.push(navigation + parameters);
    }
  };

  const onNewQRSettings = (newSetting: string) => {
    setParameters(newSetting);
    Cookies.set('qrSettings', newSetting);
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
            Generate QR Code
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
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={enableGeolocation}
                            onClick={handleGeolocationChange}
                          ></Switch>
                          <Label htmlFor="r3">Location Checker</Label>
                        </div>
                      </TooltipTrigger>
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
                <Button onClick={handleGenerateQRCode}>
                  Continue To QR Code
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
