'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { formatString, toastSuccess } from '@/utils/globalFunctions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuthProviderWarning } from './auth-provider-warning';
import { AuthProviderDescription } from './auth-provider-description';
import { trpc } from '@/app/_trpc/client';
import { SuccessProviderContent } from './auth-provider-successfully-added-content';
import { useProviderContext } from '@/app/context-auth-provider';
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
import { Provider } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { AccountLinkingInfoHover } from '../account-linking-info';

// We need to get the parameters of the config function to know what to ask for
// Javascript doesn't have a pretty way of doing this, so we use a proxy to
// intercept the keys that are being accessed in the config function.

// eslint-disable-next-line @typescript-eslint/ban-types
const getDestructuredKeys = (func: Function) => {
  const keys: string[] = [];
  // we want to manually handle this property
  const ingoreKeys = ['allowDangerousEmailAccountLinking'];
  const proxy = new Proxy(
    {},
    {
      get(target, prop: string) {
        if (!ingoreKeys.includes(prop)) {
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
  data: Provider | undefined;
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isShowingTestContent, setShowingTestContent] = useState(false);
  const { activeProviders, setActiveProviders } = useProviderContext();

  if (error) {
    throw error;
  }

  const formSchema = z.object({
    keys: z.object({
      ...keys.reduce((acc: { [key: string]: z.ZodString }, key) => {
        acc[key] = z.string().min(1).trim();
        return acc;
      }, {})
    }),
    allowAccountLinking: z.boolean().optional(),
    displayName: z
      .string()
      .min(1)
      .max(30)
      .trim()
      .refine(
        (value) =>
          !activeProviders.some(
            (provider) =>
              provider.providerDisplayName.toLowerCase() === value.toLowerCase()
          ),
        {
          message: 'Display name already exists in active providers'
        }
      )
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allowAccountLinking: true
    }
  });

  const resetForm = () => {
    form.reset({
      displayName: data?.defaultDisplayName || ''
    });
    keys.forEach((key) => {
      form.resetField(`keys.${key}`);
    });
    form.resetField('displayName');
    form.resetField('allowAccountLinking');
  };

  // Update form values when `data` changes, this is setting the default display name
  // This is because the default display name changes when accessing different providers
  useEffect(() => {
    resetForm();
  }, [data]);

  const createOrUpdateProvider =
    trpc.provider.createOrUpdateProvider.useMutation();

  const submitProvider = async (inputForm: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (!data?.defaultDisplayName || !data?.key) {
        setError(new Error('No name for key.'));
        return;
      }
      const result = await createOrUpdateProvider.mutateAsync({
        provider: data.key,
        displayName: inputForm.displayName,
        clientId: inputForm.keys['clientId'],
        clientSecret: inputForm.keys['clientSecret'],
        allowDangerousEmailAccountLinking:
          inputForm.allowAccountLinking || false,
        issuer: inputForm.keys['issuer'],
        tenantId: inputForm.keys['tenantId']
      });

      resetForm();

      if (!result?.success) {
        setError(new Error('Could not create Provider.'));
      }

      setLoading(false);
      setShowingTestContent(true);
      toastSuccess(
        `Successfully added your ${inputForm.displayName} provider! Please test the provider to ensure it works by signing out.`
      );
      setActiveProviders((prev) => [
        ...prev,
        {
          providerKey: data.key,
          providerDisplayName: inputForm.displayName,
          accountLinkingEnabled: inputForm.allowAccountLinking || false
        }
      ]);
    } catch (error) {
      setError(error as Error);
    }
  };

  if (data?.key) {
    return (
      <>
        <Dialog open={isDisplaying} onOpenChange={resetForm}>
          <DialogContent
            className="sm:max-w-[550px] lg:max-w-[750px]"
            onClose={() => {
              setIsDisplaying(false);
              setTimeout(() => {
                setShowingTestContent(false);
              }, 300);
            }}
          >
            <ScrollArea className="w-full rounded-md max-h-[90vh] ">
              {isShowingTestContent ? (
                <SuccessProviderContent />
              ) : (
                <div className="px-4">
                  <DialogHeader>
                    <DialogTitle>
                      Configure a {data?.defaultDisplayName} Provider
                    </DialogTitle>

                    {data?.CustomMessage && (
                      <div className="py-4">
                        <data.CustomMessage />
                      </div>
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
                      <FormField
                        control={form.control}
                        name="displayName"
                        key="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Display Name"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the display name for the provider.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {keys.map((key, index) => (
                        <FormField
                          control={form.control}
                          name={`keys.${key}`}
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
                                Enter your {data?.defaultDisplayName}{' '}
                                {formatString(key)}.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name="allowAccountLinking"
                        key="allowAccountLinking"
                        defaultValue={true}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={true /*checked={Boolean(field.value)*/}
                                disabled={true}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="flex justify-between items-center">
                                Allow Account Linking (Temporarily Forcibly
                                Enabled)
                                <div className="ml-auto">
                                  <AccountLinkingInfoHover />
                                </div>
                              </FormLabel>
                              <FormDescription>
                                Enable this option to allow users to link their
                                existing accounts with the same email to this
                                provider.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Loading...' : 'Submit'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
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
