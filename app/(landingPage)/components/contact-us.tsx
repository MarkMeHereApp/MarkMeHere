'use client';
import { Textarea } from '@/components/ui/textarea';
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
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { submitContactUsForm } from '@/data/landing-page/submit-contact-us-form';
import Loading from '@/components/general/loading';
import { CheckCircledIcon } from '@radix-ui/react-icons';

const formSchema = z.object({
  name: z.string().min(2),
  email: z
    .string()
    .email()
    .min(2, {
      message: 'Username must be at least 2 characters.'
    })
    .refine((value) => value.endsWith('.edu'), {
      message: 'Please enter a valid .edu email address.'
    }),
  message: z.string().optional()
});

export function ContactUsDialog({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  if (error) {
    setLoading(false);
    throw error;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { message } = await submitContactUsForm(values);
      setSubmitMessage(message);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  }

  useEffect(() => {
    if (submitMessage !== '') {
      setTimeout(() => {
        setOpen(false);
        form.reset();
        setSubmitMessage('');
      }, 5000);
    }
  }, [submitMessage]);

  const SubmitMessage = () => {
    return (
      <DialogContent className="max-w-[550px]">
        <div className="flex flex-col items-center justify-center h-[300px]">
          <CheckCircledIcon className="w-32 h-32 text-green-500 mb-8" />
          <p> {submitMessage} </p>
        </div>
      </DialogContent>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {submitMessage ? (
        <SubmitMessage />
      ) : (
        <DialogContent className="max-w-[550px]">
          <ScrollArea className="w-full rounded-md max-h-[90vh] ">
            <DialogHeader>
              <DialogTitle>Contact Us!</DialogTitle>
              <DialogDescription>
                Enter your <b>.edu</b> email and we will contact you!
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ben" {...field} />
                      </FormControl>
                      <FormDescription>Enter Your Name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ben@ucf.edu" {...field} />
                      </FormControl>
                      <FormDescription>Enter Your Edu Email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the message you want to send and we will respond
                        as soon as we can.
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
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
}
