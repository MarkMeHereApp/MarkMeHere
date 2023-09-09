import { NextRequest, NextResponse } from 'next/server';
import { appRouter } from '@/server';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';

export async function GET(req: NextRequest) {
  //Needed to call TRPC routes from serverside
  const caller = appRouter.createCaller({});

  const queryQR: string | null = req.nextUrl.searchParams.get('qr');
  const qr: string = queryQR ?? ''; //Convert string | null type to string

  try {
    // the server-side call
    const { success } = await caller.qr.ValidateQRCode({ qr: qr });
    console.log(success);

    //If qr code is valid create new attendance token in database and redirect to
    //mark attendance page that will make a db call to mark you present and show
    //either success or failure
    if (success) {
      //Create attendance token
      // return NextResponse.json({ message: `Valid QR code` });
      console.log("successfully redirecting")
      return NextResponse.redirect(new URL('/', req.url))
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
