import { cookies } from 'next/headers';
import { appRouter } from '@/server';
import { decode } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';

/*  
***NOTES***

In nextjs13 server components do not have access to the request object
so we have to get the JWT from the cookies and decode it ourself
if we had request object we could do const token = await getToken({ req })

My first approach was to pass the data we need as cookies so we can grab them 
on this page. This however is tricker than I thought because I need to persist 
these cookies across NextAuth. Currently I do not know of a way to do this.

Using this method this page will need various checks for edge cases concerning 
missing cookies

IMPLEMENTATION


const attendanceTokenId: string =
cookieStore.get('attendanceTokenId')?.value ?? '';
const lectureId: string = cookieStore.get('lectureId')?.value ?? '';
const courseId: string = cookieStore.get('courseId')?.value ?? '';
*/

export default async function markAttendance({
  searchParams
}: {
  searchParams: {
    attendanceTokenId: string;
    lectureId: string;
    courseId: string;
  };
}) {
  /* 
  Initialize TRPC caller (needed to call TRPC routes serverside) and cookiestore
  Grab and decode JWT from cookies.
  Grab url parameters
   */

  let attendance = { success: false };
  const caller = appRouter.createCaller({});
  const cookieStore = cookies();

  const encodedJWT: string | undefined = cookieStore.get(
    'next-auth.session-token'
  )?.value;

  const jwt: JWT | null = await decode({
    token: encodedJWT,
    secret: process.env.NEXTAUTH_SECRET ?? ''
  });

  const email: string = jwt?.email ?? '';
  const attendanceTokenId = searchParams.attendanceTokenId;
  const lectureId = searchParams.lectureId;
  const courseId = searchParams.courseId;

  console.log("course", courseId)
  console.log("lecture", lectureId)
  console.log("tokenId",attendanceTokenId)
  console.log("email", email);

  //COOKIE IMPLEMENTATION//
  // const attendanceTokenId: string =
  // cookieStore.get('attendanceTokenId')?.value ?? '';
  // const lectureId: string = cookieStore.get('lectureId')?.value ?? '';
  // const courseId: string = cookieStore.get('courseId')?.value ?? '';

  try {
    /*
     1. Check if attendance token is valid
     2. If valid, lookup user course member row
     3. If courseMember exists, use courseMember ID to mark student here
     4. Delete used attendance token
     */

    const { success } = await caller.recordQRAttendance.FindAttendanceToken({
      tokenId: attendanceTokenId,
      lectureId: lectureId
    });

    if (success) {
      const { courseMember } = await caller.recordQRAttendance.FindCourseMember(
        {
          courseId: courseId,
          email: email,
          role: 'student'
        }
      );

      if (courseMember) {
        const courseMemberId: string = courseMember.id;
        attendance = await caller.recordQRAttendance.MarkAttendance({
          lectureId: lectureId,
          courseMemberId: courseMemberId,
          status: 'here'
        });

        await caller.recordQRAttendance.DeleteAttendanceToken({
          tokenId: attendanceTokenId,
          lectureId: lectureId
        });
      } else {
        console.log({ error: 'course member not found' });
      }
    } else {
      console.log({ error: 'Invalid attendance token' });
    }
  } catch (error) {
    console.log({ error: error });
  }

  return (
    <>
      {attendance.success ? (
        // Render this content if attendance.success is truthy
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          {/* Add your content for success case here */}
          user successfully marked attended
        </div>
      ) : (
        <div>
          {/* Add your content for failure case here */}
          An error occurred or attendance was not successful.
        </div>
      )}
    </>
  );
}
