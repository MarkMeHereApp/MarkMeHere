import InputPage from './components/inputPage';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';
import { kv as redis } from '@vercel/kv';
import { redirect } from 'next/navigation';
import { qrcode } from '@prisma/client';
import { zAttendanceTokenType } from '@/types/sharedZodTypes';
import { validateAndCreateToken } from '../(dashboard)/[organizationCode]/[courseCode]/(student)/student/utils/studentHelpers';

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
