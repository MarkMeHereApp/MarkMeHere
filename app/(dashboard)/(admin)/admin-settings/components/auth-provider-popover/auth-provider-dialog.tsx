'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { providerFunctions } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { formatString } from '@/utils/globalFunctions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { AuthProviderWarning } from './auth-provider-warning';
import { AuthProviderDescription } from './auth-provider-description';

type ProviderSubmissionDialogProps = {
  isDisplaying: boolean;
  setIsDisplaying: Dispatch<SetStateAction<boolean>>;
  data: (typeof providerFunctions)[keyof typeof providerFunctions] | undefined;
};

export function ProviderSubmissionDialog({
  isDisplaying,
  setIsDisplaying,
  data
}: ProviderSubmissionDialogProps) {
  // We need to get the parameters of the config function to know what to ask for
  // Javascript doesn't have a pretty way of doing this, so we use a proxy to
  // intercept the keys that are being accessed in the config function.

  // eslint-disable-next-line @typescript-eslint/ban-types
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
  let initialValues: { [key: string]: string } = {};
  if (typeof data?.config === 'function') {
    keys = getDestructuredKeys(data.config);
    initialValues = keys.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
  }

  if (!keys || (keys.length === 0 && isDisplaying)) {
    throw new Error('No keys found');
  }

  const [values, setValues] = useState(initialValues);

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const allKeysHaveValues = () => {
    return Object.values(values).every((value) => value !== '');
  };

  const submitProvider = () => {
    console.log(values);
    setValues((prev) => {
      const newValues = { ...prev };
      for (const key in newValues) {
        newValues[key] = '';
      }
      return newValues;
    });
    setIsDisplaying(false);
  };

  if (data?.key) {
    return (
      <>
        <Dialog open={isDisplaying}>
          <DialogContent
            className="sm:max-w-[450px]"
            onClose={() => setIsDisplaying(false)}
          >
            <ScrollArea className="w-full rounded-md">
              <DialogHeader>
                <DialogTitle>
                  Configure a {data?.displayName} Provider
                </DialogTitle>

                {!data?.tested && (
                  <AuthProviderWarning docsLink={data?.nextAuthDocs} />
                )}

                <DialogDescription>
                  <AuthProviderDescription data={data} />
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {keys.map((key, index) => (
                  <div
                    className="grid grid-cols-4 items-center gap-4"
                    key={index}
                  >
                    <Label htmlFor={key} className="text-right">
                      {formatString(key)}
                    </Label>
                    <Input
                      id={key}
                      className="col-span-3"
                      value={values[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />{' '}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  submitProvider();
                }}
                disabled={!allKeysHaveValues()}
              >
                Add {data?.displayName} Provider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    return <></>;
  }
}
