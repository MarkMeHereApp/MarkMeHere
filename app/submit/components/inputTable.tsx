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




const InputTable = () => { 

    const [inputValue,setInputValue] = useState('')
    const [error,setError] = useState<string | null>(null);
    //const error = useRef(false)
    const errorTrigger = useRef(false)
    const errorMessage = useRef('')

    const router = useRouter(); 

    const searchParams = useSearchParams();
    const errorType = searchParams ? searchParams.get('error') : null;

    const validateAndCreateToken = trpc.attendanceToken.ValidateAndCreateAttendanceToken.useMutation();
    const submitCode =  async () => {
        

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
               
    }



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
    }, [errorType]);



    // const errorDisplay =  async (type: string) => {
    //     console.log(type)

    //     if(type === 'qr-error'){
    //         errorTrigger.current = true
            
    //         useEffect(() => {
    //             toast({
    //                 title: 'The QR code is not valid',
    //                 description:
    //                 'The QR code you scanned is no longer valid or has expired, scan again or enter a new code.',
    //                 icon: 'error_for_destructive_toasts',
    //                 variant: 'destructive',
    //             });
    //         }, []);
            
            
    //         console.log('got to qr error display')
            
    //     }

    //     if(type === 'input-error'){

    //         useEffect(() => {
    //             toast({
    //                 title: 'The input code is not valid',
    //                 description:
    //                 'The code you input is not valid or has expired, enter a new code.',
    //                 icon: 'error_for_destructive_toasts',
    //                 variant: 'destructive',
    //             });
    //         }, []);
            
    //         console.log('got to input error display')
            
    //     }
            
    // }



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
                />
                
                <Button onClick={() => submitCode()} className=' flex w-[100%]'>
                    <div className=''>Submit</div>
                </Button>
            </div>

            
                  
            
      </Card>
      
    )
}

export default InputTable;
