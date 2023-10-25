'use client'
import { Card, CardTitle } from "@/components/ui/card"
import React, {  useEffect,useState,useRef, useMemo } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Loading from '@/components/general/loading';
import { info } from "console";
import GoogleMapsComponent from "./googleMapsComponent";

enum WarningType {
  Info,
  InvalidLocation,
  ValidLocation,
  DisabledLocation,
  LocationUnavailable,
  NoLocation,
  DefaultError
}

const VerifiactionLoader: React.FC<{ code?: string }> = ({ code }) =>{
  
  const [allowedRange,setAllowedRange] = React.useState<number>(50) //this will in the future serve as the professors ability to pick the range of the classroom 
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const router = useRouter()

  const studentLatitude = useRef<number>(0)
  const studentLongitude = useRef<number>(0)

  const rangeValidator = useRef<boolean>(false)
  const range = useRef<number>(0)

  const [warningDisplay, setWarningDisplay] = useState<string | null>(null); //error message that is being displayed if either QR code is not valid or the input code is not valid
  const infoTrigger = useRef<boolean>(true)

  const [isFirstClickNoLocation, setIsFirstClickNoLocation] = useState<boolean>(true);
  const [isFirstClickVerified, setIsFirstClickVerified] = useState<boolean>(true);

  const [proceedButtonText, setProceedButtonText] = useState<string>('Continue')

  const displayWarning = (warningType: WarningType, additionalInformation: any) => {
    switch (warningType) {
      case WarningType.Info:
        setWarningDisplay('');
        toast({
          title: `Make sure you are within ${additionalInformation} feet from your professor`,
          description:
            `Professor of this course allows students to be in range of ${additionalInformation} feet`,
          icon: 'warning',
          //variant: 'destructive'
        });
        break;
      case WarningType.ValidLocation:
        setWarningDisplay('Your Location Is Valid!');
        toast({
          title: 'Your Location Is Valid!',
          description:
            `You are ${additionalInformation} feet away from the professor. Therefore, your attendance record will be valid.`,
          icon: 'success',
          
        });
        break;
      case WarningType.InvalidLocation:
        setWarningDisplay('Get Closer to Your Classroom');
        toast({
          title: 'Get Closer to Your Classroom',
          description:
            `You are ${additionalInformation} feet away from the professor. If you want to prevent any penalties, get closer to your classroom!`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.DisabledLocation:
        setWarningDisplay('Please Enable Your Location!');
        toast({
          title: 'Please Enable Your Location!',
          description:
            `Your location is disabled, please enable your location in order to get your attendance record correctly.`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;
      
      case WarningType.LocationUnavailable:
        setWarningDisplay('Could not verify location');
        toast({
          title: 'We could not verify your location',
          description:
            `We were not able to verify your location, make sure you do not have Airplane mode on.`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.NoLocation:
        setWarningDisplay('Proceed without location');
        toast({
          title: 'You are about to proceed WITHOUT sharing your location!',
          description:
            `This lecture requires your location to be shared. Proceeding without it might result in absence!`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.DefaultError:
      setWarningDisplay('Uncategorized Error Occured');
        toast({
          title: 'Uncategorized Error Occured!',
          description:
            `This Error is caused by unknown reason, please scan the QR Code again or continue to submit page and enter the code again`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;
    }
  };

  const CheckGeolocation = () =>{

    setIsLoadingSubmit(true);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          studentLatitude.current = position.coords.latitude;
          studentLongitude.current = position.coords.longitude;
          console.log(`Latitude: ${studentLatitude.current}, Longitude: ${studentLongitude.current}`);
          await ValidateGeolocation(); // Call ValidateGeolocation after getting geolocation
        }, (error) => {
            if(error.code === error.PERMISSION_DENIED){
              displayWarning(WarningType.DisabledLocation, null)
            }

            if(error.code === error.POSITION_UNAVAILABLE){
              displayWarning(WarningType.LocationUnavailable, null)
            }
            console.error("Error occurred while getting geolocation", error);
        });
    }

    
    else{
      console.log("Geolocation is not supported by this browser.");
    }
  }



  const validateGeolocation = trpc.attendanceToken.ValidateGeolocation.useMutation()
  const ValidateGeolocation = async () => {

    if (!isFirstClickVerified) {
      //first warn the student that this step might result in this absence
      //on second press
      router.push(`/student?attendanceTokenId=${code}`)
    }

    if(code){
      try {
        const res = await validateGeolocation.mutateAsync({
          id: code,
          studentLatitude: studentLatitude.current,
          studentLongtitude: studentLongitude.current
        });
  
  
        if (res.success && code == res.id) {
          if(res.distance){ // here we can add how far does the professor allow the students to be 
            
            const distanceRounded = parseFloat(res.distance.toFixed(2))

            if(distanceRounded > 50){
              rangeValidator.current = false
              setIsFirstClickVerified(false)
              setProceedButtonText('INVALID')
              displayWarning(WarningType.InvalidLocation,distanceRounded)
            }

            if(distanceRounded <= 50){
              rangeValidator.current = true
              setIsFirstClickVerified(false)
              setProceedButtonText('VALID')
              displayWarning(WarningType.ValidLocation,distanceRounded)
            }
            range.current = res.distance // idk I need to trigger this somehow PLEASE ALDRICH         
          }        
        }
  
        if (!res.success) {
          displayWarning(WarningType.DefaultError, null)
        }

        }catch (error) {
          console.log(error);
          displayWarning(WarningType.DefaultError, null)

        }finally {
          setIsLoadingSubmit(false);
        }
      };    
    }


    const ContinueNoLocation = () => {
      if (isFirstClickNoLocation) {
        setIsFirstClickNoLocation(false);
        displayWarning(WarningType.NoLocation, null)
      } 
      if (!isFirstClickNoLocation) {
        //first warn the student that this step might result in this absence
        //on second press
        router.push(`/student?attendanceTokenId=${code}`)
      }
    }


    useEffect(()=>{
      if(infoTrigger.current){
        displayWarning(WarningType.Info,allowedRange)
        infoTrigger.current = false
      }

    },[infoTrigger.current])

    
    return (
        <Card className=" min-w-[300px] w-[25%] mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
          <CardTitle className="text-2xl font-bold font-mono text-center pb-[20px]">
            <span>Location Verification</span>
          </CardTitle>
          
          <GoogleMapsComponent latitude={28.602382123205356} longtitude={-81.20026260122206}></GoogleMapsComponent>

          <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
            <Button 
              className="flex w-[100%]"
              disabled={isLoadingSubmit}
              onClick={() => CheckGeolocation()} >
              
              {isLoadingSubmit ? <Loading/> : 
                <div>
                  {isFirstClickVerified ? 'Verify My Location' : `Continue with ${proceedButtonText} Location`}
                </div>}
            </Button>

            <Button 
              className="flex w-[100%] min-w-[100%]"
              disabled={isLoadingSubmit}
              onClick={() => ContinueNoLocation()}
              variant="destructive">
              
              
            <div className="">{isFirstClickNoLocation ? 'Proceed Without Verification' : 'Are you sure?'}</div>
            </Button>   
          </div>

               
        </Card>
        )
}

export default VerifiactionLoader