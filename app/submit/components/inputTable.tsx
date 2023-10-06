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
    const error = useRef(false)
    const errorMessage = useRef('')
    const router = useRouter(); 

    const searchParams = useSearchParams();
    const errorType = searchParams ? searchParams.get('error') : null;

    console.log(errorType)

    if(errorType){
        router.push(`/submit`)
    }
    console.log(errorType)

    const validateAndCreateToken = trpc.attendanceToken.ValidateAndCreateAttendanceToken.useMutation();
    
    const submitCode =  async () => {
        
        console.log(inputValue)

        try{
            const res = await validateAndCreateToken.mutateAsync({
                code: inputValue
            })

            //console.log(res)

            if(res.success){
                router.push(`/markAttendance?attendanceTokenId=${res.token}`)
            }

            else{
                router.push(`/submit?error=code_error`)
            }

        }catch(error){

            
            console.log(error)
        }          
        
    }


    useEffect(() => {

        console.log(error.current)

        if(searchParams.has('qr-error')){
            toast({
                title: 'The code is not valid',
                description:
                'The code you used is not valid or has expired, scan again or enter a new code.',
                icon: 'warning'
            });
            errorMessage.current = 'Invalid QR Code'
            router.push(`/submit`);
        }

        if (error) {
            toast({
                title: 'The code is not valid',
                description:
                'The code you used is not valid or has expired, scan again or enter a new code.',
                icon: 'error_for_destructive_toasts',//error_for_destructive_toasts
                variant: 'destructive'
            });
                error.current = true
                errorMessage.current = 'Invalid Code'
                
                      
            }

            error.current = false
        
    }, [error]);
    

    return(
        
        <Card className=" min-w-[300px] w-[25%] mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
               
            <CardTitle className='text-2xl font-bold font-mono text-center'>
                <span className={firaSansFont.className}>
                    Enter the Code
                </span>
            </CardTitle>

            
                <Alert className='text-center text-red-500 border-0'>
                {error && (
                    <AlertDescription className=''>{errorMessage.current}</AlertDescription>   
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
