import { NextRequest, NextResponse } from 'next/server';
import { appRouter } from '@/server';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { cookies } from 'next/headers';

/*
Here we need to figure out why the redirect does not work when we make this route
a post request
*/

export async function GET(req: NextRequest) {
  //Needed to call TRPC routes from serverside
  const caller = appRouter.createCaller({});
  const params = req.nextUrl.searchParams;

  const queryQR: string | null = params.get('qr');
  const queryCourseId: string | null = params.get('courseId');

  //Convert string | null type to string
  const qr: string = queryQR ?? '';
  const courseId: string = queryCourseId ?? '';

  try {
    // the server-side call
    //In this call also make sure qr code we are retrieving is before expiration date
    const { success } = await caller.recordQRAttendance.ValidateQRCode({
      qr: qr,
      courseId: courseId
    });

    /*GET LECTURE/COURSE ID OUT OF DATABASE IN THIS ENDPOINT^^^^*/
    /*Maybe pass lectureId into attendance token instead of course*/

    //If QR code is valid create an attendance token
    if (success) {
      const { token } = await caller.recordQRAttendance.CreateAttendanceToken({
        courseId: courseId
      });
      const expires = new Date();
      /*
      Make sure cookie expires 10 seconds after it is created
      Alternatively we can remember to delete the cookie when we are done (This may be better)
      We will have read the cookie and rendered the page before it expires
      */


      /*SEE IF WE CAN SET A COOKIE OBJECT TO STORE MULTIPLE VALUES IN ONE*/

      cookies().set({
        name: 'attendanceTokenId',
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/dashboard',
        expires: expires.setSeconds(expires.getSeconds() + 100)
      });

      cookies().set({
        name: 'courseId',
        value: courseId,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/dashboard',
        expires: expires.setSeconds(expires.getSeconds() + 100)
      });

      return NextResponse.redirect(new URL('/dashboard/student/markAttendance', req.url));
    } else {
      return NextResponse.json({
        error: { message: `Invalid QR code or courseId` }
      });
    }
  } catch (cause) {
    // If this a tRPC error, we can extract additional information.
    if (cause instanceof TRPCError) {
      // We can get the specific HTTP status code coming from tRPC (e.g. 404 for `NOT_FOUND`).
      const httpStatusCode = getHTTPStatusCodeFromError(cause);

      return NextResponse.json({ error: { message: cause.message } });
    }

    // This is not a tRPC error, so we don't have specific information.
    return NextResponse.json({
      error: { message: `Error while accessing post with ID` }
    });
  }
}
