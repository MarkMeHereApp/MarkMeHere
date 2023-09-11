import { cookies } from 'next/headers';
import { appRouter } from '@/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';

//This component will need various checks for edge cases concerning missing cookies

export default async function markAttendance() {
  //In nextjs13 server components do not have access to the request object
  //So we have to get the JWT from the cookies and decode it ourself
  //If we had request object we could do const token = await getToken({ req })
  const cookieStore = cookies();
  const encodedJWT: string | undefined = cookieStore.get(
    'next-auth.session-token'
  )?.value;
  const jwt = await decode({
    token: encodedJWT,
    secret: process.env.NEXTAUTH_SECRET || ''
  });

  const email = jwt?.email || '';
  const courseId: string = cookieStore.get('courseId')?.value || '';
  const attendanceTokenId: string =
    cookieStore.get('attendanceTokenId')?.value || '';

  /*
  If cookies are empty error out here
  */

  //Needed to call TRPC routes from serverside
  const caller = appRouter.createCaller({});

  //Find attendance token in table
  //If token is found look up user
  //Then mark them attended
  /*WE STILL NEED COURSE ID BELOW SO IT WILL HAVE TO BE IN A COOKIE*/
/*USE LECTURE ID HERE TO CHECK*/
  /* Check attendance token is valid */
  const { success } = await caller.recordQRAttendance.FindAttendanceToken({
    courseId: courseId,
    tokenId: attendanceTokenId
  });

  /* If token lookup is successfull look up the user and mark them attended */
  /* If not error out */
  if (success) {
    /*Now look up course member using user email and course. Grab id of courseMember*/
    const { courseMember } = await caller.recordQRAttendance.FindCourseMember({
      courseId: courseId,
      email: email,
      role: 'student'
    });

    const courseMemberId: string = courseMember?.id || '';

    const { success } = await caller.recordQRAttendance.MarkAttendance({
      courseId: courseId,
      courseMemberId: courseMemberId,
      status: 'here'
    });

    /*Here check success value and tell student on frontend
    If they have been marked here or not*/
  } else {
    console.log({ error: 'Invalid attendance token' });
  }
  //Use course member id to mark them attended

  /*Then mark course member as attended using courseMemberId and courseId*/

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"></div>
    </>
  );
}
