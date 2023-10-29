'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { firaSansFont } from '@/utils/fonts';

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
import SettingsDisplayPage from './[organizationCode]/[courseCode]/(faculty)/user-settings/display/page';

export default function InitiallyCreateSchool() {
  const [displayingForm, setDisplayingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const createOrganization = trpc.organization.createOrganization.useMutation();

  if (error) {
    setLoading(false);
    throw error;
  }

  const formSchema = z.object({
    schoolname: z.string().min(2, {
      message: 'School name must be at least 2 characters.'
    }),
    uniqueCode: z
      .string()
      .min(1, {
        message: 'School abbreviation must be at least 1 character.'
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
      const school = await createOrganization.mutateAsync({
        uniqueCode: data.uniqueCode,
        name: data.schoolname
      });

      if (school) {
        redirect(`/${school.uniqueCode}`);
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
            <span className={firaSansFont.className}>
              <h2 className="text-3xl font-bold">Welcome To Mark Me Here!</h2>
            </span>
            <div className="mt-4">
              <ContinueButton
                name="Create Your School"
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
                      name="schoolname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="University Of Central Florida"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your full School name. For Example:{' '}
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
                          <FormLabel>School Abbreviation</FormLabel>
                          <FormControl>
                            <Input placeholder="UCF" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your unique School abbreviation. For
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
