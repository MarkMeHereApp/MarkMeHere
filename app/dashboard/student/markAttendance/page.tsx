import { cookies } from 'next/headers';
import { appRouter } from '@/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { decode } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

//This component will need various checks for edge cases concerning missing cookies

export default async function markAttendance() {
  //In nextjs13 server components do not have access to the request object
  //So we have to get the JWT from the cookies and decode it ourself
  //If we had request object we could do const token = await getToken({ req })
  try {
    const cookieStore = cookies();
    const encodedJWT: string | undefined = cookieStore.get(
      'next-auth.session-token'
    )?.value;
    const jwt: JWT | null = await decode({
      token: encodedJWT,
      secret: process.env.NEXTAUTH_SECRET ?? ''
    });

    const email = jwt?.email ?? '';
    const attendanceTokenId: string =
      cookieStore.get('attendanceTokenId')?.value ?? '';
    const lectureId: string = cookieStore.get('lectureId')?.value ?? '';
    const courseId: string = cookieStore.get('courseId')?.value ?? '';

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
    console.log(cookieStore);
    console.log("attendanceTokenId: " + attendanceTokenId)
    console.log("lectureId: " + lectureId)
    console.log("courseId: " + courseId)
    const { success } = await caller.recordQRAttendance.FindAttendanceToken({
      lectureId: lectureId,
      tokenId: attendanceTokenId
    });

    /* If token lookup is successfull look up the user and mark them attended */
    /* If not error out */
    if (success) {
      /*Now look up course member using user email and course. Grab id of courseMember*/
      const { courseMember } = await caller.recordQRAttendance.FindCourseMember(
        {
          courseId: courseId,
          email: email,
          role: 'student'
        }
      );

      if (courseMember) {
        const courseMemberId: string = courseMember.id;
        const { success } = await caller.recordQRAttendance.MarkAttendance({
          lectureId: lectureId,
          courseMemberId: courseMemberId,
          status: 'here'
        });
      } else {
        console.log('ERROR course member not found');
      }
      console.log('student marked attended successfully!!!');

      /*Here check success value and tell student on frontend
    If they have been marked here or not*/
    } else {
      console.log({ error: 'Invalid attendance token' });
    }
  } catch (error) {
    console.error('An error occured while marking attendance', error);
  }

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex"></div>
    </>
  );
}
