import * as React from 'react';
import Link from 'next/link';
import { ContactUs } from '../components/contact-us';
import { CopyableClipboard } from '@/components/general/copy-text';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function UnauthorizedEmail() {
  const crypto = require('crypto');
  const randomString = crypto.randomBytes(16).toString('hex');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[800px] ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Get Started Today!
          </CardTitle>
          <CardDescription className="text-lg">
            For the Alpha we are using Vercel to host the app, they have a free
            tier that support a few classrooms. If you go beyond the free tier
            please{' '}
            <ContactUs>
              <Button variant={'outline'} size={'xs'}>
                <b>Contact Us</b>
              </Button>
            </ContactUs>
            .
            <br />
            <CopyableClipboard textToCopy={randomString} />
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
