import { NextRequest, NextResponse } from 'next/server';
import { appRouter } from '@/server';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export async function POST(req: NextRequest) {
  //Needed to call TRPC routes from serverside
  const caller = appRouter.createCaller({});
  const params = req.nextUrl.searchParams;

  const queryQR: string | null = params.get('qr');
  const queryCourseId: string | null = params.get('lectureId');

  //Convert string | null type to string
  const qr: string = queryQR ?? '';
  const courseId: string = queryCourseId ?? '';

  try {
    // the server-side call
    const { success } = await caller.recordQRAttendance.ValidateQRCode({
      qr: qr,
      courseId: courseId
    });


    //Here we need to redirect to our attendance marked page
    //and mark their attendance from there


    //If QR code is valid create an attendance token
    if (success) {
      await caller.recordQRAttendance.CreateAttendanceToken({
        courseId: courseId
      });
      //return NextResponse.redirect(new URL('/', req.url));
    } else {
      return NextResponse.json({
        error: { message: `Invalid QR code` }
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
