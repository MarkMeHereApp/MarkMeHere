import * as React from 'react';
import { ContactUsDialog } from '../components/contact-us';

import { CopyableClipboard } from '@/components/general/copy-text';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import crypto from 'crypto';

export default function UnauthorizedEmail() {
  const string = crypto.randomBytes(16).toString('hex');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[800px] ">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              Random 32 Character Secret
            </CardTitle>
          </div>
          <div className="py-6">
            Looks like you are trying to setup Mark Me Here! You need to enter a
            random 32 character secret to secure your data. If you already have
            data tied to an existing secret, you must use that value to continue
            using that data. If this is the first time setting up the app, you
            can use the value below. Please
            <span className="px-2">
              <ContactUsDialog>
                <Button variant={'outline'} size={'xs'}>
                  <b>Contact Us</b>
                </Button>
              </ContactUsDialog>
            </span>
            if you run into any issues.
          </div>

          <div className="pb-6">
            <CopyableClipboard textToCopy={string} />
            <code className="pl-6 text-sm">NEXTAUTH_SECRET</code>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
