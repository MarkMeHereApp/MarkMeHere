import * as React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function UnauthorizedEmail({
  searchParams
}: {
  searchParams: { email: string };
}) {
  const cookieStore = cookies();
  const callbackUrl = cookieStore.get('next-auth.callback-url');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[600px] border-destructive">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Your Email Is Unauthorized!
          </CardTitle>
          <CardDescription className="text-lg">
            <br />
            Login failed. The email <b>{searchParams.email}</b> isn't linked to
            a course or registered user.
            <br />
            <br />
            If this email is correct, contact an administrator or try a
            different email.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end">
          <Link href={callbackUrl?.value || '/signin'}>
            <Button>Go Back To Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
