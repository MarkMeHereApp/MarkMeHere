import { GetServerSidePropsContext } from 'next';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";
import VerifiactionLoaderPage from './components/verificationPage';


export default async function VerificationPage({searchParams}: {searchParams: any}) {

    let attendanceTokenId = ''

    if(searchParams.hasOwnProperty('attendanceTokenId')){
        attendanceTokenId = searchParams.attendanceTokenId
        console.log(attendanceTokenId)
    }


  return (
    
      <div className="relative h-screen">
          <VerifiactionLoaderPage code = {attendanceTokenId}></VerifiactionLoaderPage>
      </div>
    
  )
}
