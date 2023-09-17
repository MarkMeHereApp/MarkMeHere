'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { providerFunctions } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { formatString } from '@/utils/globalFunctions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyableClipboard } from '@/components/general/copy-text';
type ProviderSubmissionDialogProps = {
  isDisplaying: boolean;
  setIsDisplaying: Dispatch<SetStateAction<boolean>>;
  data: (typeof providerFunctions)[keyof typeof providerFunctions] | undefined;
};
import { ScrollArea } from '@/components/ui/scroll-area';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export function ProviderSubmissionDialog({
  isDisplaying,
  setIsDisplaying,
  data
}: ProviderSubmissionDialogProps) {
  // We need to get the parameters of the config function to know what to ask for
  // Javascript doesn't have a pretty way of doing this, so we use a proxy to
  // intercept the keys that are being accessed in the config function.

  const getDestructuredKeys = (func: Function) => {
    const keys: string[] = [];
    const proxy = new Proxy(
      {},
      {
        get(target, prop: string | symbol) {
          if (typeof prop === 'string') {
            keys.push(prop);
          }
          return '';
        }
      }
    );

    func(proxy);
    return keys;
  };

  let keys: string[] = [];
  if (typeof data?.config === 'function') {
    keys = getDestructuredKeys(data.config);
  }

  if (!keys || (keys.length === 0 && isDisplaying)) {
    throw new Error('No keys found');
  }

  return (
    <Dialog open={isDisplaying}>
      <DialogContent
        className="sm:max-w-[450px]"
        onClose={() => setIsDisplaying(false)}
      >
        <ScrollArea className="	 w-full rounded-md ">
          <DialogHeader>
            <DialogTitle>Configure a {data?.displayName} Provider</DialogTitle>

            {!data?.tested && (
              <div className="py-4">
                <Alert>
                  <ExclamationTriangleIcon />
                  <AlertTitle>Warning!</AlertTitle>
                  <AlertDescription>
                    This Provider is untested.{' '}
                    <a
                      href={`https://github.com/MarkMeHereApp/MarkMeHere/issues`}
                    >
                      <b className="text-primary">Click here</b>
                    </a>{' '}
                    to report any issues you encounter. For more information,
                    see{' '}
                    <a href={data?.nextAuthDocs}>
                      <b className="text-primary">
                        the next-auth documentation.
                      </b>
                    </a>{' '}
                    <i>
                      Note our implementation of next-auth uploades the token
                      into our database, instead of storing it in the
                      environment variables which is what the next-auth
                      documentation assumes.
                    </i>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <DialogDescription>
              <a href={data?.creationLink}>
                <b className="text-primary">Click here</b>
              </a>{' '}
              to create the OAuth application through {data?.displayName}. Click
              save when you're done.
              {data?.key && (
                <>
                  <div className="py-2">
                    <p className="py-1">
                      Use the following as the homepage URL:
                    </p>
                    <CopyableClipboard
                      textToCopy={`${process.env.NEXT_PUBLIC_BASE_URL}`}
                    />
                  </div>
                  <div className="py-2">
                    <p className="py-1">
                      Use the following as the callback URL:
                    </p>
                    <CopyableClipboard
                      textToCopy={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/${data?.key}`}
                    />
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {keys.map((key, index) => (
              <div className="grid grid-cols-4 items-center gap-4" key={index}>
                <Label htmlFor={key} className="text-right">
                  {formatString(key)}
                </Label>
                <Input id={key} className="col-span-3" />
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              setIsDisplaying(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
