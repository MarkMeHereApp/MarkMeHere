'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { firaSansLogo } from '@/utils/fonts';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { ContinueButton } from '@/components/general/continue-button';
import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { redirect } from 'next/navigation';
import Loading from '@/components/general/loading';

export default function InitiallyCreateOrganization() {
  const [displayingForm, setDisplayingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const createOrganization = trpc.sessionless.createOrganization.useMutation();

  if (error) {
    setLoading(false);
    throw error;
  }

  const formSchema = z.object({
    organizationname: z.string().min(2, {
      message: 'Organization name must be at least 2 characters.'
    }),
    uniqueCode: z
      .string()
      .min(1, {
        message: 'Organization abbreviation must be at least 1 character.'
      })
      .refine((value) => /^[a-zA-Z-]+$/.test(value), {
        message: 'Only letters and "-" are allowed.'
      })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const organization = await createOrganization.mutateAsync({
        uniqueCode: data.uniqueCode,
        name: data.organizationname
      });

      if (organization) {
        redirect(`/${organization.uniqueCode}`);
      } else {
        setError(new Error('Something went wrong. Please try again.'));
      }
    } catch (e) {
      setError(e as Error);
    }
  };

  return (
    <>
      {!displayingForm ? (
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex flex-col items-center">
            <MarkMeHereClassAnimation />
            <span className={firaSansLogo.className}>
              <h2 className="text-3xl font-bold">Welcome To Mark Me Here!</h2>
            </span>
            <div className="mt-4">
              <ContinueButton
                name="Create Your Organization"
                onClick={() => setDisplayingForm(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-[600px]">
            <CardHeader>
              <CardDescription className="text-lg">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="organizationname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="University Of Central Florida"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your full Organization name. For Example:{' '}
                            <b>University of Central Florida</b>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uniqueCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Abbreviation</FormLabel>
                          <FormControl>
                            <Input placeholder="UCF" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your unique Organization abbreviation. For
                            Example: <b>UCF</b>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      {loading ? (
                        <Button disabled={true} variant={'outline'}>
                          <Loading />
                        </Button>
                      ) : (
                        <ContinueButton type="submit" />
                      )}
                    </div>
                  </form>
                </Form>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
}
