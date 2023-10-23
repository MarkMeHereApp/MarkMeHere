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
      }
    });

    console.log(qrResult + 'error')

    if (qrResult === null) {
      return { success: false };
    }

    console.log(qrResult.ProfessorLectureGeolocationId)

    const { id } = await prisma.attendanceToken.create({
      data: {
        token: uuidv4(),
        lectureId: qrResult.lectureId,
        ProfessorLectureGeolocationId: qrResult.ProfessorLectureGeolocationId
      }
    });

    
    return { success: true, token: id, location: qrResult.ProfessorLectureGeolocationId };
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
    } else {

    }
  };


  //Checking if the submit page was called via scanning a QR code or accessed by typing /submit
  //If ?qr=XXXXX is included, we call handleToken(), which calls the validation endpoint.
  

  if(searchParams.hasOwnProperty('qr')){
    console.log("QR Param included")
    qrCode = searchParams.qr; // Extracting the QR from the URL and assigning it to qrCode

    const validateToken = await handleToken();
    const location = validateToken?.location
    const id = validateToken?.token

    if(validateToken?.success){
      if(location && id){
        console.log('the token as location included: ' + location + 'token id: ' + id)
        redirect(`/verification?attendanceTokenId=${id}`)
      }
      
      if(!location && id){
        console.log('location not included only token id: ' + id)
        redirect(`/student?attendanceTokenId=${id}`)
      }
    }

    else{
      redirect(`/submit?error=qr-error`)//add error to the url and then retrieve it 
    }

  }


  //Not used for now
  if(searchParams.hasOwnProperty('error')){
    console.log("Error Param included")
    error = searchParams.error
  }

  return (
    
      <div className="relative h-screen">
          <InputPage></InputPage>
      </div>
    
  )
}
