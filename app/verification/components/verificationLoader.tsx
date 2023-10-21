'use client'
import { Card, CardTitle } from "@/components/ui/card"
import React, {  useEffect,useState,useRef, useMemo } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";


const VerifiactionLoader: React.FC<{ code?: string }> = ({ code }) =>{
    
  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);

  const router = useRouter()

  const studentLatitude = useRef<number>(0)
  const studentLongitude = useRef<number>(0)


  const rangeValidator = useRef<boolean>(false)
  const range = useRef<number>(0)

  const geoWatchId = useRef<number | null>(null);

  const CheckGeolocation = () =>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          studentLatitude.current = position.coords.latitude;
          studentLongitude.current = position.coords.longitude;
          console.log(`Latitude: ${studentLatitude.current}, Longitude: ${studentLongitude.current}`);
          await ValidateGeolocation(); // Call ValidateGeolocation after getting geolocation
        }, (error) => {
            console.error("Error occurred while getting geolocation", error);
        });
    }
    else{
      console.log("Geolocation is not supported by this browser.");
    }
  }


  const validateGeolocation = trpc.attendanceToken.ValidateGeolocation.useMutation()
  const ValidateGeolocation = async () => {
    setIsLoadingSubmit(true);

    if(code){
      try {
        const res = await validateGeolocation.mutateAsync({
          id: code,
          studentLatitude: studentLatitude.current,
          studentLongtitude: studentLongitude.current
        });
  
        console.log(res);
  
        if (res.success) {
          if(res.distance){ // here we can add how far does the professor allow the students to be 
            range.current = res.distance // idk I need to trigger this somehow PLEASE ALDRICH
            rangeValidator.current = true
          }
          
          //If range.current<some value: router push, else display warning message. 
          if(code == res.id){
            console.log('IDs are matching!')
            //router.push(`/student?attendanceTokenId=${code}`);
          }
          
        }
  
        if (!res.success) {
          
          console.log('Error while checking the code')
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingSubmit(false);
      }
    };
    
    
    }

    const ContinueNoLocation = () => {
      //first warn the student that this step might result in this absence
      //on second press
      router.push(`/student?attendanceTokenId=${code}`)
    }

    useEffect(()=>{
      toast({
        title: `You are ${range.current} miles away from the professor`,
        description:
          'Your Locatin has been verified',
        icon: 'error_for_destructive_toasts',
        variant: 'destructive'
      });
    },[rangeValidator.current])

    return (
        <Card className=" min-w-[300px] w-[25%] mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
          <CardTitle className="text-2xl font-bold font-mono text-center">
            <span>Please Verify Your Location</span>
          </CardTitle>

          <div className="gap-4 flex flex-col items-center pt-5 p-6">
            <Button 
              className="flex w-[100%]"
              disabled={isLoadingSubmit}
              onClick={() => CheckGeolocation()} >
              
              {isLoadingSubmit && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <div className="">
                Check the Geolocation
              </div>
            </Button>

            <Button 
              className=" flex w-[100%] min-w-[100%]"
              disabled={isLoadingSubmit}
              onClick={() => ContinueNoLocation()}>
              
            <div className="">Proceed without </div>
            </Button>   
          </div>

               
        </Card>
        )
}

export default VerifiactionLoader