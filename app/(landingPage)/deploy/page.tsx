'use client';

import * as React from 'react';
import { ContactUsDialog } from '../components/contact-us';
import { TermsOfServiceDialog } from '../components/terms-and-conditions';
import { Checkbox } from '@/components/ui/checkbox';
import { CopyableClipboard } from '@/components/general/copy-text';
import { getPublicUrl } from '@/utils/globalFunctions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';
import { Copy } from 'lucide-react';

export default function UnauthorizedEmail() {
  const [boxChecked, setBoxChecked] = useState(false);

  const [randomString, setRandomString] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const crypto = require('crypto');
    const string = crypto.randomBytes(16).toString('hex');
    setRandomString(string);
    setLink(
      `https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMarkMeHereApp%2FMarkMeHere&stores=[{"type":"postgres"}]&env=NEXTAUTH_SECRET&envDescription=Please%20use%20a%20random%2032%20character%20string%20for%20this.&envLink=https%3A%2F%2Fwww.markmehere.com%2Fdocs%2Fintro&project-name=mark-me-here&repository-name=MarkMeHere&demo-title=Deploy%20Mark%20Me%20Here!&demo-description=Host%20your%20own%20instance%20of%20Mark%20Me%20Here%20with%20Vercel!&demo-url=https%3A%2F%2Fwww.markmehere.com&demo-image=https%3A%2F%2Fmedia.discordapp.net%2Fattachments%2F1164879821122322543%2F1164882603074138112%2FMMH-White.png%3Fex%3D6544d477%26is%3D65325f77%26hm%3Dd33830c6f4b6aeb0019a53103d459d9381b2b903e7eedf21a3e385b81e40ed0d%26%3D%26width%3D1610%26height%3D905&redirect-url=${getPublicUrl()}/successful-deployment`
    );
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[800px] ">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              Get Started Today!
            </CardTitle>
            <Link href={'/'}>
              <ContinueButton
                name="Go Back"
                variant="outline"
                size={'sm'}
              ></ContinueButton>
            </Link>
          </div>
          <CardDescription className="text-lg">
            <div className="py-6">
              For the Alpha we are using Vercel to host the app, but don't
              worry, it only takes a few minutes to setup. If you have any
              issues installing the app please{' '}
              <ContactUsDialog>
                <Button variant={'outline'} size={'xs'}>
                  <b>Contact Us</b>
                </Button>
              </ContactUsDialog>
              .
            </div>

            <div className="pb-6">
              <div className="pb-4">
                You will need a 32 character random string to secure your data.
                When Vercel asks for the <code>NEXTAUTH_SECRET</code>, you can
                use this value:
              </div>
              <CopyableClipboard textToCopy={randomString} />
              <code className="pl-6 text-sm">NEXTAUTH_SECRET</code>
            </div>

            <div className="flex items-center space-x-2 pb-6">
              <Checkbox
                id="terms"
                onCheckedChange={(change) => {
                  if (typeof change === 'boolean') {
                    setBoxChecked(change);
                  }
                }}
              />{' '}
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Please Accept the Terms and Conditions To Continue{' '}
                <TermsOfServiceDialog>
                  <Button size={'xs'} className="ml-4">
                    View Terms and Conditions
                  </Button>
                </TermsOfServiceDialog>
              </label>
            </div>

            {link && (
              <div>
                <Link href={boxChecked ? link : '/deploy'}>
                  <ContinueButton
                    disabled={!boxChecked}
                    name="Deploy Mark Me Here!"
                  ></ContinueButton>
                </Link>
              </div>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
