import { NextRequest, NextResponse } from 'next/server';
import { appRouter } from '@/server';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { createContext } from '@/server/context';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getToken } from 'next-auth/jwt';
//import { cookies } from 'next/headers';

/*
***NOTES*** 

Here we need to figure out why the redirect does not work when we make this route
a post request

My first approach was to pass the data we need as cookies so we can grab them on the
markAttendance page. This however is tricker than I thought because I need to persist 
these cookies across NextAuth. Currently I do not know how to do this.

Passing cookies through nextAuth is a grey area. So we will pass what we need
in the url we are redirecting to instead of cookies

IMPLEMENTATION

const expires = new Date();
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
  name: 'lectureId',
  value: qrRow.lectureId,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/dashboard',
  expires: expires.setSeconds(expires.getSeconds() + 100)
});

cookies().set({
  name: 'courseId',
  value: qrRow.courseId,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/dashboard',
  expires: expires.setSeconds(expires.getSeconds() + 100)
});

*/

export async function GET(nextReq: NextRequest, req: Request, resHeaders: Headers) {
  /*
  Initialize TRPC caller (needed to call TRPC routes serverside).
  Grab QR from URL parameters.
  1. Validate QR code sent as URL parameter
  2. If QR code is valid create an attendance token
  (Attendance token used to authenticate user attendance even after QR code expires)
  3. Redirect to markAttendance page with URL parameters
  */

  const caller = appRouter.createCaller(await createContext({req, resHeaders}));
  const params = nextReq.nextUrl.searchParams;

  const qr: string = params.get('qr') ?? '';

  try {
    //In the future make sure qr code we are retrieving is before expiration date
    const qrResult = await caller.recordQRAttendance.ValidateQRCode({
      qr: qr
    });

    if (!!qrResult.success) {
      const qrRow = qrResult.qrRow;
      const { token } = await caller.recordQRAttendance.CreateAttendanceToken({
        lectureId: qrRow?.lectureId || ''
      });

      const queryParams = new URLSearchParams();
      queryParams.append('attendanceTokenId', token);
      queryParams.append('lectureId', qrRow?.lectureId ?? '');
      queryParams.append('courseId', qrRow?.courseId ?? '');

      return NextResponse.redirect(
        new URL(
          `/dashboard/student/markAttendance?${queryParams.toString()}`,
          req.url
        )
      );
    } else {
      return NextResponse.json({
        error: { message: `Invalid QR code, lectureId, or courseId` }
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
      error: {
        message: `Error while validating QR code or creating attendance token`
      }
    });
  }
}
