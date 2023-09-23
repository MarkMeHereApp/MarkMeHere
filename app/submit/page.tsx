'use client';
import InputPage from "./components/inputPage";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter,useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SubmitPage = () => {
   

  const router = useRouter(); //init Router
  const [code,setCode] = useState('');

  const pathname = usePathname() //storing the path name. Not used
  const searchParams = useSearchParams() //storing if there is QR passed or not
  
  
  // Just testing what is being returned 
  const test = () => {
    console.log("router " + router)
    console.log("pathname " + pathname )
    console.log("searchPrams " + searchParams)

    if(!searchParams.toString()){
      console.log("No Params!!")
    }
  }

 //take the params and send it as a token. 
 //Maybe check if the params are 6 char just to make sure there is not random numeber, but the valiadtion will be done in backend I believe. 
 
 if(searchParams.toString()){
    return(
      <>
        <h1>You Should not be here but redirected !!!</h1>
      </>
      
    )
  }
  
  else{
    return(   
      <>
        <InputPage></InputPage>
        <Button onClick={()=>test()} className="absolute"></Button>
      </>
    )
  }


  
}

export default SubmitPage;
