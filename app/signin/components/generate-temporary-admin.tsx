'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { PiUserCircleGear } from 'react-icons/pi';
import { trpc } from '@/app/_trpc/client';
import Loading from '@/components/general/loading';
import { signIn } from 'next-auth/react';

const zAdminGeneratorForm = z.object({
  adminSecret: z.string().min(1).max(255).trim()
});

type AdminGeneratorFormProps = z.infer<typeof zAdminGeneratorForm>;

const GenerateTemporaryAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const form = useForm<AdminGeneratorFormProps>({
    resolver: zodResolver(zAdminGeneratorForm),
    defaultValues: {
      adminSecret:
        process.env.NEXT_PUBLIC_DEMO_TEMP_ADMIN_SECRET?.toString() || ''
    }
  });

  if (error) {
    throw error;
  }
  const generateAdminMutation = trpc.sessionless.GenerateNewAdmin.useMutation();

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  const demoMode = !!process.env.NEXT_PUBLIC_DEMO_TEMP_ADMIN_SECRET;

  async function onSubmit(data: AdminGeneratorFormProps) {
    try {
      form.reset();
      setLoading(true);
      await signIn('credentials', {
        key: data.adminSecret,
        callbackUrl: demoMode ? '/' : '/admin-settings'
      });
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => handleDialogOpen()}>
            <PiUserCircleGear className="mr-2 h-5 w-5" />
            Log Into Temp Admin
          </Button>
        </DialogTrigger>
        <DialogContent onClose={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Log Into Temporary Admin</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {!demoMode ? (
              <div>
                <p>Please Enter the Admin Secret from you .env below.</p>
                <p>For example if your secret was:</p>
                <code>
                  ADMIN_GENERATOR_SECRET=8de1d54992c8bc0d66ffc21dea27d60b
                </code>
                <p>
                  <b>You would enter: "8de1d54992c8bc0d66ffc21dea27d60b"</b>
                </p>
              </div>
            ) : (
              <div>
                <p>
                  You are currently in demo mode, proceeed by clicking "Log In
                  To Temp Admin"
                </p>
              </div>
            )}
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="adminSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Secret</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={demoMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loading /> : 'Log In To Temp Admin'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateTemporaryAdmin;
