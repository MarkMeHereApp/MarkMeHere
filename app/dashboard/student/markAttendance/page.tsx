import { cookies } from 'next/headers';
import { appRouter } from '@/server';
import { getToken } from "next-auth/jwt"
import { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';



export default async function markAttendance() {
  //In nextjs13 server components do not have access to the request object
  //So we have to get the JWT from the cookies and decode it ourself
  //If we had request objetc we could do const token = await getToken({ req })
  const cookieStore = cookies();
  /*
  Nextjs13 uses getToken({req}) to retrieve the token from server.
  Netxjs13 no longer uses getServerSideProps so we dont have access to this method
  This means we need to get the JWT from cookies and decode it ourselves for now
*/
  const encodedJWT = cookieStore.get('next-auth.session-token')?.value || '';
  const jwt = await decode({
    token: encodedJWT,
    secret: process.env.NEXTAUTH_SECRET || '',
  });

  //Needed to call TRPC routes from serverside
  const caller = appRouter.createCaller({});

  

  const courseId: string = cookieStore.get('courseId')?.value || '';
  const attendanceTokenId: string =
    cookieStore.get('attendanceTokenId')?.value || '';

   
  
  console.log(jwt)
  /*
  If cookies are empty error out here
  */

  /*Now look up course member using user email and course. Grab id of courseMember*/

  // const courseMember = await caller.recordQRAttendance.FindCourseMember({
  //   courseId: courseId,
  //   // email: 
  // });

  /*Then mark course member as attended using courseMemberId and courseId*/

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"></div>
    </>
  );
}
