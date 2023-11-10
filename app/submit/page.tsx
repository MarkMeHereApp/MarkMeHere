import InputPage from './components/inputPage';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { kv as redis } from '@vercel/kv';
import { redirect } from 'next/navigation';
import { qrcode } from '@prisma/client';

async function validateAndCreateToken(qrCode: string) {
  try {
    /* 
    Find our qr code in Redis here 
    If we successfully find the matching qr code then 
    create an attendance token in redis

    When we validate the token we should also look up the course 
    associated with it to grab the organization id
    */
    // const qrResult = await prisma.qrcode.findUnique({
    //   where: {
    //     code: qrCode
    //   },
    //   include: {
    //     course: true
    //   }
    // });

    //Find qrCode
    const qrKey = 'qrCode:' + qrCode;
    const qrResult: qrcode | null = await redis.hgetall(qrKey);

    if (!qrResult) return { success: false };

    //Find course
    const course = await prisma.course.findUnique({
      where: {
        id: qrResult.courseId
      }
    });

    if (!course) return { success: false };

    const attendanceToken = uuidv4();
    const attendanceTokenId = uuidv4();
    const attendanceTokenKey = 'attendanceToken:' + attendanceTokenId;

    //Create attendance token
    const attendanceTokenObj = {
      token: attendanceToken,
      lectureId: qrResult.lectureId,
      professorLectureGeolocationId: qrResult.professorLectureGeolocationId
    };

    await redis
      .multi()
      .hset(attendanceTokenKey, attendanceTokenObj)
      .expire(attendanceTokenKey, 300)
      .exec();

    // const { id } = await prisma.attendanceToken.create({
    //   data: {
    //     token: uuidv4(),
    //     lectureId: qrResult.lectureId,
    //     ProfessorLectureGeolocationId: qrResult.ProfessorLectureGeolocationId
    //   }
    // });

    return {
      success: true,
      token: attendanceTokenId,
      location: qrResult.professorLectureGeolocationId,
      organizationCode: course.organizationCode,
      courseCode: course.courseCode
    };
  } catch (error) {
    throw error;
  }
}

export default async function SubmitPage({
  searchParams
}: {
  searchParams: any;
}) {
  if (searchParams.hasOwnProperty('qr')) {
    const qrCode = searchParams.qr; // Extracting the QR from the URL and assigning it to qrCode
    const validateToken = await validateAndCreateToken(qrCode);

    if (validateToken?.success) {
      const location = validateToken?.location;
      const id = validateToken?.token;

      if (location && id) {
        redirect(
          `${validateToken.organizationCode}/${validateToken.courseCode}/verification?attendanceTokenId=${id}`
        );
      }

      if (!location && id) {
        redirect(
          `/${validateToken.organizationCode}/${validateToken.courseCode}/student?attendanceTokenId=${id}`
        );
      }
    } else {
      redirect(`/submit?error=qr-error`); //add error to the url and then retrieve it
    }
  }

  //Not used for now
  if (searchParams.hasOwnProperty('error')) {
    const error = searchParams.error;
  }

  return (
    <div className="relative h-screen">
      <InputPage></InputPage>
    </div>
  );
}
