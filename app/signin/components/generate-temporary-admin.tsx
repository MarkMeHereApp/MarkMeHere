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
import TempAdminInfo from './info/temp-admin-info';

const zAdminGeneratorForm = z.object({
  adminSecret: z.string().min(1).max(255).trim()
});

type AdminGeneratorFormProps = z.infer<typeof zAdminGeneratorForm>;

const GenerateTemporaryAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const form = useForm<AdminGeneratorFormProps>({
    resolver: zodResolver(zAdminGeneratorForm)
  });

  if (error) {
    throw error;
  }

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  async function onSubmit(data: AdminGeneratorFormProps) {
    try {
      form.reset();
      setLoading(true);
      await signIn('credentials', {
        tempAdminKey: data.adminSecret,
        callbackUrl: '/'
      });
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <>
      <TempAdminInfo />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => handleDialogOpen()}>
            <PiUserCircleGear className="mr-2 h-5 w-5" />
            Log Into Temp Admin
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Into Recovery Admin</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div>
              <p>
                Please Enter the Admin Recover Password from you .env below.
              </p>
              <p>For example if your secret was:</p>
              <code>ADMIN_RECOVER_PASSWORD=password</code>
              <p>
                <b>You would enter: "password"</b>
              </p>
            </div>
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
                    <FormLabel>Admin Recovery Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
