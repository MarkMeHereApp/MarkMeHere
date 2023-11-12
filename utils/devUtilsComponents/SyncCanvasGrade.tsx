import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { SyncCanvasGrade, SyncCanvasUsers } from './SyncCanvasUsers';


export const SyncCanvasMembersButton = async () => {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if(!session?.user.email) {
    throw new Error("No Email")
  }
  
  const user = await prisma.user.findFirst({
    where: {email: session.user.email}
  })

  if (!user?.canvasUrl || !user?.canvasToken){
    return <></>
  }

  return <SyncCanvasUsers/>



};

export const SyncCanvasAttendanceButton = async () => {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if(!session?.user.email) {
    throw new Error("No Email")
  }
  
  const user = await prisma.user.findFirst({
    where: {email: session.user.email}
  })

  if (!user?.canvasUrl || !user?.canvasToken){
    return <></>
  }

  return <SyncCanvasGrade/>


};
