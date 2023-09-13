import { cookies } from 'next/headers';
import { decode } from 'next-auth/jwt';
import type { JWT } from 'next-auth/jwt';
import prisma from '@/prisma';
import { AttendanceEntry } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

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
  let errorMessage: string | null = null;

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

    const tokenRow = await prisma.attendanceToken.findFirst({
      where: {
        id: attendanceTokenId,
        lectureId: lectureId
      }
    });

    if (tokenRow) {
      const courseMember = await prisma.courseMember.findFirst({
        where: {
          courseId: courseId,
          email: 'bewerner23@gmail.com',
          role: 'student'
        }
      });

      if (courseMember) {
        const courseMemberId: string = courseMember.id;

        let attendanceEntry: AttendanceEntry | null = null;

        const existingAttendanceEntry = await prisma.attendanceEntry.findFirst({
          where: {
            lectureId: lectureId,
            courseMemberId: courseMemberId
          }
        });

        if (existingAttendanceEntry) {
          attendanceEntry = await prisma.attendanceEntry.update({
            where: {
              id: existingAttendanceEntry.id
            },
            data: {
              status: 'here'
            }
          });
        } else {
          attendanceEntry = await prisma.attendanceEntry.create({
            data: {
              lectureId: lectureId,
              courseMemberId: courseMemberId,
              status: 'here'
            }
          });
        }

        await prisma.attendanceToken.delete({
          where: {
            id: attendanceTokenId,
            lectureId: lectureId
          }
        });

        if (!attendanceEntry) {
          errorMessage = 'invalid attendance token';
        }
      } else {
        errorMessage = 'course member not found';
      }
    } else {
      errorMessage = 'invalid attendance token';
    }
  } catch (error) {
    const ErrorType = error as Error;
    errorMessage = ErrorType.message;
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {/* Add your content for success case here */}
        {errorMessage ? (
          <div className="text-red-500">{errorMessage}</div>
        ) : (
          <div className="text-green-500">Attendance marked</div>
        )}
      </div>
    </>
  );
}
