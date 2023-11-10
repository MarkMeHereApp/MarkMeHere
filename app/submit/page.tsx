import InputPage from './components/inputPage';
import { GetServerSidePropsContext } from 'next';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "next/navigation";


async function validateAndCreateToken(
  qrCode: string,
) {
  try {
    const qrResult = await prisma.qrcode.findUnique({
      where: {
        code: qrCode
      },
      include:{
        course: true
      }
      
    });

    if (qrResult === null) {
      return { success: false };
    }

    const { id } = await prisma.attendanceToken.create({
      data: {
        token: uuidv4(),
        lectureId: qrResult.lectureId,
        ProfessorLectureGeolocationId: qrResult.ProfessorLectureGeolocationId
      }
    });

    
    return { success: true, token: id, location: qrResult.ProfessorLectureGeolocationId, course: qrResult.course };
  } catch (error) {
    throw error;
  }

}

export default async function SubmitPage({searchParams}: {searchParams: any}) {
  

  let qrCode = ''
  let error = ''  
  

  const handleToken = async () => {
    
    const res = await validateAndCreateToken(qrCode)
  
    if(res){
      return res;
    } 
  };

  if(searchParams.hasOwnProperty('qr')){
    qrCode = searchParams.qr; // Extracting the QR from the URL and assigning it to qrCode

    const validateToken = await handleToken();
    
    if(validateToken?.success){
      const location = validateToken?.location
      const id = validateToken?.token

      if(location && id){
        redirect(`${validateToken.course.organizationCode}/${validateToken.course.courseCode}/verification?attendanceTokenId=${id}`)
      }
      
      if(!location && id){
        redirect(`/${validateToken.course.organizationCode}/${validateToken.course.courseCode}/student?attendanceTokenId=${id}`)
      }
    }

    else{
      redirect(`/submit?error=qr-error`)//add error to the url and then retrieve it 
    }

  }


  //Not used for now
  if(searchParams.hasOwnProperty('error')){
    error = searchParams.error
  }

  return (
    
      <div className="relative h-screen">
          <InputPage></InputPage>
      </div>
    
  )
}
