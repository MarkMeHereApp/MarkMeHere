'use client'
import { Card, CardTitle } from "@/components/ui/card"
import React, {  useEffect,useState,useRef } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'components/ui/use-toast';
import { Button } from "@/components/ui/button";
import Loading from '@/components/general/loading';
import GoogleMapsComponent from "./googleMapsComponent";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';

enum WarningType {
  Info,
  InvalidLocation,
  ValidLocation,
  DisabledLocation,
  LocationUnavailable,
  NoLocation,
  DefaultError
}

const VerifiactionLoader: React.FC<{ code?: string}> = ({code})=>{
  
  //displaying toasts based on specific resuts
  const displayWarning = (warningType: WarningType, additionalInformation: any) => {
    switch (warningType) {
      case WarningType.Info: //First intro message that infroms the student about the allowed distance from the professor
        setWarningDisplay('');
        toast({
          title: `Make sure you are within ${additionalInformation} feet from your professor`,
          description:
            `Professor of this course allows students to be in range of ${additionalInformation} feet`,
          icon: 'warning',
          //variant: 'destructive'
        });
        break;
      case WarningType.ValidLocation://if location found to be valid
        setWarningDisplay('Your Location Is Valid!');
        toast({
          title: 'Your Location Is Valid!',
          description:
            `You are ${additionalInformation} feet away from the professor. Therefore, your attendance record will be valid.`,
          icon: 'success',
          
        });
        break;
      case WarningType.InvalidLocation://if location found to NOT be valid
        setWarningDisplay('Get Closer to Your Classroom');
        toast({
          title: 'Get Closer to Your Classroom',
          description:
            `You are ${additionalInformation} feet away from the professor. If you want to prevent any penalties, get closer to your classroom!`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.DisabledLocation://if location is not enabled from the user
        setWarningDisplay('Please Enable Your Location!');
        toast({
          title: 'Please Enable Your Location!',
          description:
            `Your location is disabled, please enable your location in order to get your attendance record correctly.`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;
      
      case WarningType.LocationUnavailable://if for some reason location is not able to be verified (airplane mode)
        setWarningDisplay('Could not verify location');
        toast({
          title: 'We could not verify your location',
          description:
            `We were not able to verify your location, make sure you do not have Airplane mode on.`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.NoLocation://if user decides not to verify his/her location
        setWarningDisplay('Proceed without location');
        toast({
          title: 'You are about to proceed WITHOUT sharing your location!',
          description:
            `This lecture requires your location to be shared. Proceeding without it might result in absence!`,
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
            
        });
        break;

      case WarningType.DefaultError://default error
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

  const [allowedRange,setAllowedRange] = React.useState<number>(50) //this will in the future serve as the professors ability to pick the range of the classroom 
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false); //loader trigger
  const router = useRouter()//router init

  //stores locally professors and students coordinates that are then passed to the geolocation component
  const studentLatitude = useRef<number>(0)
  const studentLongitude = useRef<number>(0)

  const professorLatitude = useRef<number>(0)
  const professorLongitude = useRef<number>(0)

  const rangeValidator = useRef<boolean>(false)//validate range trigger
  const range = useRef<number>(0)//stores the distance between professor and student 

  const [warningDisplay, setWarningDisplay] = useState<string | null>(null); //error message that is being displayed if either QR code is not valid or the input code is not valid
  const infoTrigger = useRef<boolean>(true)//initial info about range that should be displayed

  const [isFirstClickNoLocation, setIsFirstClickNoLocation] = useState<boolean>(true);//handling double clicks for proceed without Location
  const [isFirstClickVerified, setIsFirstClickVerified] = useState<boolean>(true);//handling double clicks for Verified - unsucessful verification

  const [proceedButtonText, setProceedButtonText] = useState<string>('Continue')

  //coordiantes for GoogleMap component
  const locationData = {
    studentLatitude: studentLatitude.current,
    studentLongitude: studentLongitude.current,
    professorLatitude: professorLatitude.current,
    professorLongitude: professorLongitude.current,
  };

  const [isOpen, setIsOpen] = useState(true)
  
  const handleOpen = () => {
    setIsOpen(true)
  }

  const { currentCourseUrl } =
    useCourseContext();

  //Checking Geolocation
  const CheckGeolocation = () =>{
    setIsLoadingSubmit(true);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          studentLatitude.current = position.coords.latitude;
          studentLongitude.current = position.coords.longitude;
          await ValidateGeolocation(); // Call ValidateGeolocation after getting geolocation - Thats where the backend is called
        }, (error) => {
            if(error.code === error.PERMISSION_DENIED){ // if the user did not allow the location
              displayWarning(WarningType.DisabledLocation, null)
            }

            if(error.code === error.POSITION_UNAVAILABLE){
              displayWarning(WarningType.LocationUnavailable, null) // if the position is not available for any reason
            }           
        });

    }

    
    else{
      console.log("Geolocation is not supported by this browser.");
    }
  }



  const validateGeolocation = trpc.attendanceToken.ValidateGeolocation.useMutation()
  const ValidateGeolocation = async () => {

    if(code){
      try {
        const res = await validateGeolocation.mutateAsync({
          id: code,
          studentLatitude: studentLatitude.current,
          studentLongtitude: studentLongitude.current,
        });
  
  
        if (res.success && code == res.id) {

          //assigning the response to the local value
          professorLatitude.current = res.lectureLatitude 
          professorLongitude.current = res.lectureLongtitude
          
          if(res.distance){ // here we can add how far does the professor allow the students to be 
            
            //rounding to two decimal nums
            const distanceRounded = parseFloat(res.distance.toFixed(2))

            //if distance is more than allowed range
            if(distanceRounded > 250){
              rangeValidator.current = false
              setProceedButtonText('Unverified')
              displayWarning(WarningType.InvalidLocation,distanceRounded)
            }

            //if distance is less or equal to allowed range
            if(distanceRounded <= 250){
              rangeValidator.current = true
              setProceedButtonText('Verified')
              displayWarning(WarningType.ValidLocation,distanceRounded)
            }
            range.current = distanceRounded 
          }        
        }
  
        if (!res.success) {
          displayWarning(WarningType.DefaultError, null)
          rangeValidator.current = false

        }

        }catch (error) {
          console.log(error);
          displayWarning(WarningType.DefaultError, null)

        }finally {
          setIsLoadingSubmit(false);
        }
      };    
    }

    //handles the dialoge 
    const ContinueWithDiscoveredLocation = () => {
      if(!rangeValidator.current){
        if(range.current > 250){
  
          if (isFirstClickVerified) {
            setIsFirstClickVerified(false)
            displayWarning(WarningType.NoLocation, null)
          } 
          if (!isFirstClickVerified) {
            router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`)
          }
        }
        else{
          displayWarning(WarningType.DefaultError, null)
        }
      }   

      if(range.current <= 250){
        rangeValidator.current = true
        setProceedButtonText('Verified')
        router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`)
      }        
    }

    //handles proceed without geolocation
    const ContinueNoLocation = () => {
      if (isFirstClickNoLocation) {
        setIsFirstClickNoLocation(false);
        displayWarning(WarningType.NoLocation, null)
      } 
      if (!isFirstClickNoLocation) {
        //first warn the student that this step might result in this absence
        router.push(`${currentCourseUrl}/student?attendanceTokenId=${code}`)
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
          <CardTitle className="text-2xl font-bold font-mono text-center">
            <span>Location Verification</span>
          </CardTitle>

          <div className="gap-4 flex flex-col items-center pt-5 w-[100%]">
            <Dialog>
              <DialogTrigger asChild onClick={handleOpen}>

               <Button   
                  className="flex w-full"
                  disabled={isLoadingSubmit}
                  onClick={() => {
                    CheckGeolocation()
                    
                    }} >
                       {isLoadingSubmit ? <Loading/> : 'Verify My location' }
                </Button>
                
                </DialogTrigger>
                {!isLoadingSubmit && isOpen && 
                (<DialogContent className="w-full">
                  <GoogleMapsComponent postitonsData={locationData}></GoogleMapsComponent>
                    {!rangeValidator.current ? 
                      <Button 
                        className="flex w-[100%] min-w-[100%]"
                        disabled={isLoadingSubmit}
                        onClick={() => {
                            ContinueWithDiscoveredLocation()
                        }}
                        variant="destructive">
                        <div className="mr-[5px]">
                          {isFirstClickVerified ? `Continue ${proceedButtonText}` : `Are you sure?`}
                        </div>
                        <CrossCircledIcon/>
                      </Button> 
                      : 
                      <Button 
                        className="flex w-[100%] min-w-[100%]"
                        disabled={isLoadingSubmit}
                        onClick={() => {
                            ContinueWithDiscoveredLocation()
                        }}>                      
                        <div className="mr-[5px]">
                          {`Continue ${proceedButtonText}`}
                        </div>
                        <CheckCircledIcon/>
                      </Button>}
                </DialogContent>)}
            </Dialog>
            
            <Button 
              className="flex w-[100%] min-w-[100%]"
              disabled={isLoadingSubmit}
              onClick={() => ContinueNoLocation()}
              variant="destructive">

              <div className="mr-[5px]">
                {isFirstClickNoLocation ? 'Proceed Without Verification' : 'Are you sure?'}
              </div>
            </Button>   
          </div>      
        </Card>)
}

export default VerifiactionLoader