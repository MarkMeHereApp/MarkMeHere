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

  const qr: string = params.get('qr') ?? '';

  try {
    // the server-side call
    //In this call also make sure qr code we are retrieving is before expiration date
    const qrResult = await caller.recordQRAttendance.ValidateQRCode({
      qr: qr
    });

    /*Maybe pass lectureId into attendance token instead of course*/

    //If QR code is valid create an attendance token
    if (!!qrResult.success) {
      //qrRow is always defined when qrResult is successful
      const qrRow = qrResult.qrRow!;
      const { token } = await caller.recordQRAttendance.CreateAttendanceToken({
        lectureId: qrRow.lectureId
      });
      /*
      Make sure cookie expires 10 seconds after it is created
      Alternatively we can remember to delete the cookie when we are done (This may be better)
      We will have read the cookie and rendered the page before it expires
      */
      /*SEE IF WE CAN SET A COOKIE OBJECT TO STORE MULTIPLE VALUES IN ONE*/

      // const expires = new Date();
      // cookies().set({
      //   name: 'attendanceTokenId',
      //   value: token,
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/dashboard',
      //   expires: expires.setSeconds(expires.getSeconds() + 100)
      // });

      // cookies().set({
      //   name: 'lectureId',
      //   value: qrRow.lectureId,
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/dashboard',
      //   expires: expires.setSeconds(expires.getSeconds() + 100)
      // });

      // cookies().set({
      //   name: 'courseId',
      //   value: qrRow.courseId,
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/dashboard',
      //   expires: expires.setSeconds(expires.getSeconds() + 100)
      // });

      //Redirect user to markAttendance page with query params
      /*Passing cookies through nextAuth is a grey area. So we will pass what we need
      in the url we are redirecting to instead of cookies*/

      // url={
      //   process.env.NEXT_PUBLIC_BASE_URL +
      //   `/api/trpc/qr.ValidateQRCode?lectureId=${encodeURIComponent(
      //     JSON.stringify(selectedCourseId)
      //   )}
      //   &qr=${encodeURIComponent(JSON.stringify(activeCode))}`
      // }

      const queryParams = new URLSearchParams();
      queryParams.append('attendanceTokenId', token);
      queryParams.append('lectureId', qrRow.lectureId);
      queryParams.append('courseId', qrRow.courseId);

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
