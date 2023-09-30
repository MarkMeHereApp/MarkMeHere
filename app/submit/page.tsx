import InputPage from "./components/inputPage"
import { GetServerSidePropsContext } from "next";
import prisma from "@/prisma";
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";
import { replace } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import { ur } from "@faker-js/faker";
import { url } from "inspector";
import { appRouter } from "@/server";
import dynamic from "next/dynamic";



async function validateAndCreateToken(
  qrCode: string,
) {
  try {
    const qrResult = await prisma.qrcode.findUnique({
      where: {
        code: qrCode
      }
    });

    if (qrResult === null) {
      return { success: false };
    }

    const { id } = await prisma.attendanceToken.create({
      data: {
        lectureId: qrResult.lectureId,
        token:  uuidv4()
      }
    });
        
    return { success: true, token: id };

    
    
  } catch (error) {
    throw error;
  }
  

}

export default async function SubmitPage({searchParams}: {searchParams: any}) {
  

  const handleToken = async () => {
    
    const res = await validateAndCreateToken(qrCode)
  
    if(res){
      console.log(res)
      return res.token;
    }
    else{

    }
    
  }
  
  console.log(searchParams)
  let qrCode = ''
  let error = ''

  if(searchParams.hasOwnProperty('qr')){
    console.log("QR Param included")
    qrCode = searchParams.qr;
    
    let receivedToken = await handleToken();
    console.log('token out: ' + receivedToken)

    if(receivedToken){
      redirect(`/markAttendance?attendanceTokenId=${receivedToken}`)
    }

    else{
      redirect(`/submit`)//add error to the url and then retrieve it 
    }
    
  }

  if(searchParams.hasOwnProperty('error')){
    console.log("Error Param included")
    error = searchParams.error
  }


  

  return (
    <>
      <div className="relative min-h-screen">
       

        <div className='flex flex-col top-0 right-0 bottom-0 h-full w-full align-middle'>
          <InputPage></InputPage>
        </div>
      </div>
    </>
  )
}
