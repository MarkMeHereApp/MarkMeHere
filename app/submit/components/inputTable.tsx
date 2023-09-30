import {Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import React, {  useState } from 'react';
import { Button } from '@/components/ui/button';

const InputTable = () => { 

    const [inputValue,setInputValue] = useState('')

    const router = useRouter(); 
  
    const submitCode = () => {
    console.log(inputValue)
    router.push(`/submit?qr=${inputValue}`)
    }
    

    return(
        <Card className="h-[30%] w-[40%] sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-6 flex flex-col items-center justify-between ">
                  
            <CardTitle className='text-3xl font-bold font-mono tracking-widest text-center'>
            Enter the Code
            </CardTitle>
            
            <Input className='w-[35%] h-[30%] text-center text-4xl'                            
            type="text" 
            value={inputValue.toUpperCase()} 
            onChange={event => setInputValue(event.target.value)} 
            />
                    
            <Button onClick={() => submitCode()} className='text-1xl w-[15%] h-[20%]'>
                <div>Submit</div>
            </Button>

      </Card>
    )
}

export default InputTable;
