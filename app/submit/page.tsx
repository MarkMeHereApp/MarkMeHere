import InputPage from './components/inputPage';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { kv as redis } from '@vercel/kv';
import { redirect } from 'next/navigation';

async function validateAndCreateToken(qrCode: string) {
  try {
    /* 
    Find our qr code in Redis here 
    If we successfully find the matchign qr code then 
    create an attendance token in redis

    When we validate teh token we should also look up the course 
    associated with it to grab the organization id
    */
    const qrResult = await prisma.qrcode.findUnique({
      where: {
        code: qrCode
      },
      include: {
        course: true
      }
    });

     //const qrResult = await redis.hgetall("qrCode:" + qrCode);

    console.log(qrResult + 'error');

    if (!qrResult) {
      return { success: false };
    }

    console.log(qrResult.ProfessorLectureGeolocationId);

    const { id } = await prisma.attendanceToken.create({
      data: {
        token: uuidv4(),
        lectureId: qrResult.lectureId,
        ProfessorLectureGeolocationId: qrResult.ProfessorLectureGeolocationId
      }
    });

    return {
      success: true,
      token: id,
      location: qrResult.ProfessorLectureGeolocationId,
      course: qrResult.course
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
  let qrCode = '';
  let error = '';

  // const handleToken = async () => {
  //   const res = await validateAndCreateToken(qrCode);

  //   if (res) {
  //     return res;
  //   }
  // };

  if (searchParams.hasOwnProperty('qr')) {
    console.log('QR Param included');
    qrCode = searchParams.qr; // Extracting the QR from the URL and assigning it to qrCode

    const validateToken = await validateAndCreateToken(qrCode);
  

    if (validateToken?.success) {
      const location = validateToken?.location;
      const id = validateToken?.token;

      if (location && id) {
        console.log(
          'the token as location included: ' + location + 'token id: ' + id
        );
        redirect(
          `${validateToken.course.organizationCode}/${validateToken.course.courseCode}/verification?attendanceTokenId=${id}`
        );
      }

      if (!location && id) {
        console.log('location not included only token id: ' + id);
        redirect(
          `/${validateToken.course.organizationCode}/${validateToken.course.courseCode}/student?attendanceTokenId=${id}`
        );
      }
    } else {
      redirect(`/submit?error=qr-error`); //add error to the url and then retrieve it
    }
  }

  //Not used for now
  if (searchParams.hasOwnProperty('error')) {
    console.log('Error Param included');
    error = searchParams.error;
  }

  return (
    <div className="relative h-screen">
      <InputPage></InputPage>
    </div>
  );
}
