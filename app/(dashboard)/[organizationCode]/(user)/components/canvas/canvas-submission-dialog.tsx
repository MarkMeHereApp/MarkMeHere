'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useState } from 'react';
import { updateUserWithCanvasData } from '@/data/user/canvas';
import { toastError, toastSuccess } from '@/utils/globalFunctions';
import Loading from '@/components/general/loading';

const formSchema = z.object({
  canvasUrl: z
    .string()
    .url()
    .refine((value) => value.endsWith('/'), {
      message: "URL must end with a '/'"
    }),
  canvasDevKey: z.string().min(2)
});

export function ConfigureCanvasUserDialog({
  children,
  onSubmit,
  organizationCode
}: {
  children: React.ReactNode;
  onSubmit: () => void;
  organizationCode: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    setLoading(false);
    throw error;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await updateUserWithCanvasData({
        inputOrganizationCode: organizationCode,
        inputUrl: values.canvasUrl,
        inputDevKey: values.canvasDevKey
      });
      setLoading(false);

      toastSuccess('Successfully configured Canvas!');
      onSubmit();
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[550px]">
        <ScrollArea className="w-full rounded-md max-h-[90vh] ">
          <DialogHeader>
            <DialogTitle>Setup Canvas Developer Token</DialogTitle>
            <DialogDescription>
              Setup your Canvas Developer Token to start syncing your courses!
            </DialogDescription>
          </DialogHeader>

          <div className="pt-6">
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="canvasUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canvas Url</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://webcourses.ucf.edu/"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter Your Canvas URL</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="canvasDevKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canvas Developer Token</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1158~c06gaXGNSTveeteQ5c4cc06gaXGNSTveeteQ5c4c"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your Canvas Developer Token.{' '}
                        <Link
                          href={
                            'https://community.canvaslms.com/t5/Admin-Guide/How-do-I-add-a-developer-API-key-for-an-account/ta-p/259'
                          }
                        >
                          <strong className="text-primary">
                            You Can View This Guide For More Info.
                          </strong>
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? <Loading /> : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
