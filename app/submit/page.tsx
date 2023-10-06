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

    if (qrResult === null) {
      return { success: false };
    }

    const { id } = await prisma.attendanceToken.create({
      data: {
        lectureId: qrResult.lectureId,
        token: uuidv4()
      }
    });

    return { success: true, token: id };
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
      return res.token;
    } else {

    }
  };


  //Checking if the submit page was called via scanning a QR code or accessed by typing /submit
  //If ?qr=XXXXX is included, we call handleToken(), which calls the validation endpoint.

  if(searchParams.hasOwnProperty('qr')){
    console.log("QR Param included")
    qrCode = searchParams.qr; // Extracting the QR from the URL and assigning it to qrCode
    
    let receivedToken = await handleToken(); 

    //If we recieve a valid token (in the end the ID) we redirect directly since the token is valid
    if(receivedToken){
      redirect(`/markAttendance?attendanceTokenId=${receivedToken}`)
    }

    //If the token was not found valid, we continue to /submit?qr-error, that is just to trigger the error in the input page
    else{
      redirect(`/submit?error=qrerror`)//add error to the url and then retrieve it 
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
