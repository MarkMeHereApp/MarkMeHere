import { GetServerSidePropsContext } from 'next';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";
import VerifiactionPage from './components/verificationPage';

async function getCourse(
    attendanceTokenId: string,
){
    try{
        const lectureId = await prisma.attendanceToken.findUnique({
            where:{
                id: attendanceTokenId
            }
        })

        if(!lectureId){
            console.log('could not find the correct attendance token')
        }

        if(lectureId === null){
            return { success: false}
        }

        const course = await prisma.course.findFirst({
            where: {
                lectures: {
                    some: {
                        id: lectureId?.lectureId
                    }
                }
            },
            include: {
                lectures: true
            }
        });


        if(course){
            return {success: true, course }
        }
        else{
            return {success: false, course: undefined}
        }

    }catch(error){
        throw error
    }
}


export default async function VerificationPage({searchParams}: {searchParams: any}) {

    let attendanceTokenId = ''
    let orgCode = ''
    let courseCode = ''

    //verifying if the attendance token is assigned to any lecture -> course
    if(searchParams.hasOwnProperty('attendanceTokenId')){
        attendanceTokenId = searchParams.attendanceTokenId
        console.log(attendanceTokenId)

        const res = await getCourse(attendanceTokenId)

        if(res.success && res.course){
            orgCode = res.course.organizationCode
            courseCode = res.course.courseCode

            console.log(res)
        }
    }
    


  return (
    
      <div className="relative h-screen">
          <VerifiactionPage code={attendanceTokenId} orgCode={orgCode} courseCode={courseCode}></VerifiactionPage>
      </div>
    
  )
}
