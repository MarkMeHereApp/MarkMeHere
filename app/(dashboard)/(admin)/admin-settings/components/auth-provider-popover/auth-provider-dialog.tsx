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
import { useState, Dispatch, SetStateAction } from 'react';
import { providerFunctions } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { formatString, toastSuccess } from '@/utils/globalFunctions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuthProviderWarning } from './auth-provider-warning';
import { AuthProviderDescription } from './auth-provider-description';
import { trpc } from '@/app/_trpc/client';
import { SuccessProviderContent } from './auth-provider-successfully-added-content';
import { useProviderContext } from '../../provider-context';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

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
  let keys: string[] = [];
  const initialValues: { [key: string]: string } = {};
  if (typeof data?.config === 'function') {
    keys = getDestructuredKeys(data.config);
    for (const key of keys) {
      initialValues[key] = '';
    }
  }

  const formSchema = z.object({
    ...keys.reduce((acc: { [key: string]: z.ZodString }, key) => {
      acc[key] = z.string().min(1);
      return acc;
    }, {})
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  if (!keys || (keys.length === 0 && isDisplaying)) {
    throw new Error('No keys found');
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isShowingTestContent, setShowingTestContent] = useState(false);
  const { setActiveProviders } = useProviderContext();

  if (error) {
    throw error;
  }
  const createOrUpdateProvider =
    trpc.provider.createOrUpdateProvider.useMutation();

  const submitProvider = async (inputForm: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (!data?.displayName || !data?.key) {
        setError(new Error('No name for key.'));
        return;
      }
      const result = await createOrUpdateProvider.mutateAsync({
        provider: data.key,
        displayName: data.displayName,
        clientId: inputForm['clientId'],
        clientSecret: inputForm['clientSecret'],
        issuer: inputForm['issuer']
      });

      keys.forEach((key) => {
        form.resetField(key);
      });

      if (!result?.success) {
        setError(new Error('Could not create Provider.'));
      }

      setLoading(false);
      setShowingTestContent(true);
      toastSuccess('Successfully added new provider!');
      setActiveProviders((prev) => [...prev, data.displayName]);
    } catch (error) {
      setError(error as Error);
    }
  };

  if (data?.key) {
    return (
      <>
        <Dialog open={isDisplaying}>
          <DialogContent
            className="sm:max-w-[450px]"
            onClose={() => {
              setIsDisplaying(false);
              setTimeout(() => {
                setShowingTestContent(false);
              }, 300);
            }}
          >
            <ScrollArea className="w-full rounded-md">
              {isShowingTestContent ? (
                <SuccessProviderContent />
              ) : (
                <>
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
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(submitProvider)}
                      className="space-y-8"
                    >
                      {keys.map((key, index) => (
                        <FormField
                          control={form.control}
                          name={key}
                          key={index}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{formatString(key)}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`**************`}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter your {data?.displayName}{' '}
                                {formatString(key)}.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Loading...' : 'Submit'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    return <></>;
  }
}

/*
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
import { useState, Dispatch, SetStateAction } from 'react';
import { providerFunctions } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { formatString, toastSuccess } from '@/utils/globalFunctions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuthProviderWarning } from './auth-provider-warning';
import { AuthProviderDescription } from './auth-provider-description';
import { trpc } from '@/app/_trpc/client';
import { SuccessProviderContent } from './auth-provider-successfully-added-content';

import { encrypt, decrypt } from '@/utils/globalFunctions';

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
  let keys: string[] = [];
  const initialValues: { [key: string]: string } = {};
  if (typeof data?.config === 'function') {
    keys = getDestructuredKeys(data.config);
    for (const key of keys) {
      initialValues[key] = '';
    }
  }

  if (!keys || (keys.length === 0 && isDisplaying)) {
    throw new Error('No keys found');
  }

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isShowingTestContent, setShowingTestContent] = useState(false);

  if (error) {
    throw error;
  }
  const createOrUpdateProvider =
    trpc.provider.createOrUpdateProvider.useMutation();

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const allKeysHaveValues = () => {
    return Object.values(values).every((value) => value !== '');
  };

  const submitProvider = async () => {
    setLoading(true);

    try {
      if (!data?.displayName || !data?.key) {
        setError(new Error('No name for key.'));
        return;
      }
      const result = await createOrUpdateProvider.mutateAsync({
        provider: data.key,
        displayName: data.displayName,
        clientId: values['clientId'],
        clientSecret: values['clientSecret'],
        issuer: values['issuer']
      });

      if (!result?.success) {
        setError(new Error('Could not create Provider.'));
      }

      setValues((prev) => {
        const newValues = { ...prev };
        for (const key in newValues) {
          newValues[key] = '';
        }
        return newValues;
      });
      setLoading(false);
      setShowingTestContent(true);
      toastSuccess('Successfully added new provider!');
    } catch (error) {
      setError(error as Error);
    }
  };

  const InputProviderContent = () => {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Configure a {data?.displayName} Provider</DialogTitle>

          {!data?.tested && (
            <AuthProviderWarning docsLink={data?.nextAuthDocs || ''} />
          )}

          <DialogDescription>
            <AuthProviderDescription data={data || {}} />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {keys.map((key, index) => (
            <div className="grid grid-cols-4 items-center gap-4" key={index}>
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

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              submitProvider();
            }}
            disabled={!allKeysHaveValues() || loading}
          >
            {loading ? 'Submitting...' : `Add ${data?.displayName} Provider`}
          </Button>
        </DialogFooter>
      </>
    );
  };

  if (data?.key) {
    return (
      <>
        <Dialog open={isDisplaying}>
          <DialogContent
            className="sm:max-w-[450px]"
            onClose={() => {
              setIsDisplaying(false);
              setTimeout(() => {
                setShowingTestContent(false);
              }, 300);
            }}
          >
            <ScrollArea className="w-full rounded-md">
              {isShowingTestContent ? (
                <SuccessProviderContent />
              ) : (
                <InputProviderContent />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    return <></>;
  }
}

*/
