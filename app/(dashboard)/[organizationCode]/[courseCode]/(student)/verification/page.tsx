import { GetServerSidePropsContext } from 'next';
import prisma from '@/prisma';
import { kv as redis } from '@vercel/kv';
import VerifiactionPage from './components/verificationPage';
import { redisAttendanceKey } from '@/utils/globalFunctions';
import { findAttendanceToken } from '../student/utils/studentHelpers';

async function getCourse(
    attendanceTokenId: string,
){
    try{
        const attendanceToken = await findAttendanceToken(attendanceTokenId)
        // const lectureId = await prisma.attendanceToken.findUnique({
        //     where:{
        //         id: attendanceTokenId
        //     }
        // })

        if(!attendanceToken){
            throw new Error ('This Attendance Token is Invalid, please scan or input the code again')
        }

        const course = await prisma.course.findFirst({
            where: {
                lectures: {
                    some: {
                        id: attendanceToken.lectureId
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

        const res = await getCourse(attendanceTokenId)

        if(res.success && res.course){
            orgCode = res.course.organizationCode
            courseCode = res.course.courseCode

        }

        else{
            throw new Error ('This Attendance Token is Invalid, please scan or input the code again')
        }
    }   


  return (
    
      <div className="relative h-screen">
          <VerifiactionPage code={attendanceTokenId} orgCode={orgCode} courseCode={courseCode}></VerifiactionPage>
      </div>
    
  )
}
