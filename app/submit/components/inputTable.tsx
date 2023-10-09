import {Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import React, {  useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useAspect } from '@react-three/drei';
import { firaSansFont } from '@/utils/fonts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';





const InputTable = () => { 

    const [inputValue,setInputValue] = useState('') //input value in the field
    const [error,setError] = useState<string | null>(null); //error message that is being displayed if either QR code is not valid or the input code is not valid

    const router = useRouter(); //initalizing the router

    const searchParams = useSearchParams(); 
    const errorType = searchParams ? searchParams.get('error') : null; //storing the searchParams with 'error' included, that is then being used the in the UseEffect below

    const [isLoading, setIsLoading] = React.useState<{ [key: string]: boolean }>(
        {}
    );

    //On Submit, button, we make a server call to validate and create the attendance token
    //the function calls, '/server/routes/attendanceToken.ts'
    //if success, we redirect straight to the markAttendance, with the specific attendanceTokenId (currently uid)
    //if fails, we display the error message specific to the invalid input
    const validateAndCreateToken = trpc.attendanceToken.ValidateAndCreateAttendanceToken.useMutation();
    const submitCode =  async () => {
        
        setIsLoading((prevState) => ({ ...prevState, credentials: true })); // Set loading to true at the start of the function

        try{
            const res = await validateAndCreateToken.mutateAsync({
                code: inputValue
            })

            console.log(res)

            if(res.success){
                router.push(`/markAttendance?attendanceTokenId=${res.token}`)
            }

            if(!res.success){
                setError('Invalid Input Code')
                toast({
                    title: 'The input code is not valid',
                    description:
                    'The code you input is not valid or has expired, enter a new code.',
                    icon: 'error_for_destructive_toasts',
                    variant: 'destructive',
                });   
            }
        }
        catch(error){
            console.log(error)
        }
        finally {
            setIsLoading((prevState) => ({ ...prevState, credentials: false })); // Set loading to false at the end of the function
        }
               
    }


    //checking what error type have we recieved in the server through the URL. 
    //after the error message being displayed, we replace the URL with /submit and stay on page.
    //if we check more things than just qr-error, it will be added as another if statement.
    useEffect(() => {
        if(errorType){
            if(errorType === 'qr-error'){
                
                setError('Invalid QR Code')



                console.log('Got here')
                    toast({
                        title: 'The QR code is not valid',
                        description:
                        'The QR code you scanned is no longer valid or has expired, scan again or enter a new code.',
                        icon: 'error_for_destructive_toasts',
                        variant: 'destructive',
                    });
               
                
            }
        }

        router.replace('/submit')
    }, [errorType]);




    return(
        
        <Card className=" min-w-[300px] w-[25%] mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
               
            <CardTitle className='text-2xl font-bold font-mono text-center'>
                <span className={firaSansFont.className}>
                    Enter the Code
                </span>
            </CardTitle>

            
                <Alert className='text-center text-red-500 border-0'>
                {error && (
                    <AlertDescription className=''>{error}</AlertDescription>   
                )}
                </Alert>

                <div className='gap-4 flex flex-col items-center pt-0 p-6'>
                
                <Input className='w-[100%] h-[30%] text-center text-4xl'                            
                type="text" 
                value={inputValue.toUpperCase()} 
                onChange={event => setInputValue(event.target.value)} 
                disabled={isLoading.credentials}
                />
                
                <Button 
                    onClick={() => submitCode()} 
                    className=' flex w-[100%]' 
                    disabled={isLoading.credentials}
                    >
                       {isLoading.credentials && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                    <div className=''>Submit</div>
                </Button>
            </div>

            
                  
            
      </Card>
      
    )
}

export default InputTable;
