import { AiOutlineUserAdd } from 'react-icons/ai';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../components/ui/form';
import { TRPCClientError } from '@trpc/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { trpc } from '@/app/_trpc/client';
import Loading from '@/components/general/loading';
import { formatString, toastError } from '../globalFunctions';
import { useUsersContext } from '@/app/(dashboard)/(admin)/context-users';
import React from 'react';
const EnrollUser = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const createUser = trpc.user.createUser.useMutation();
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useUsersContext();
  const [error, setError] = useState<Error | null>(null);
  const [selectedFormRole, setSelectedFormRole] = useState('');

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const zUsers = z.object({
    name: z
      .string()
      .min(1)
      .max(255)
      .refine((value) => value.trim() === value, {
        message: 'Value must not have leading or trailing spaces'
      }),
    email: z
      .string()
      .min(1)
      .refine((value) => value.trim() === value, {
        message: 'Value must not have leading or trailing spaces'
      }),
    role: zSiteRoles,
    optionalId: z
      .string()
      .max(255)
      .optional()
      .refine(
        (value) => value === '' || (value ? value.trim() === value : true),
        {
          message: 'Value must not have leading or trailing spaces'
        }
      )
  });

  type CourseMemberFormProps = z.infer<typeof zUsers>;

  const form = useForm<CourseMemberFormProps>({
    resolver: zodResolver(zUsers)
  });

  if (error) {
    setLoading(false);
    if (
      error instanceof TRPCClientError &&
      error.shape?.data?.isUniqueConstraintError
    ) {
      toastError(error.message);
      setError(null);
    } else {
      throw error;
    }
  }

  async function onSubmit(data: CourseMemberFormProps) {
    try {
      setLoading(true);
      const response = await createUser.mutateAsync({
        name: data.name,
        email: data.email,
        role: data.role,
        optionalId: data.optionalId
      });
      if (userData.users) {
        setUserData({
          ...userData,
          users: [...userData.users, response.user]
        });
      } else {
        setUserData({ ...userData, users: [response.user] });
      }
      setLoading(false);
      handleDialogClose();
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            onClick={() => handleDialogOpen()}
            className="flex items-center"
            style={{ maxWidth: '100%' }}
          >
            <AiOutlineUserAdd className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">Create Site User</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader onClick={handleDialogClose}>
            <DialogTitle>Create Site User</DialogTitle>
            <DialogDescription>
              Fill in the site user&apos;s information below and click create
              user when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        placeholder="Richard Leinecker"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Richard.Leinecker@ucf.edu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="moderator"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zSiteRoles.options.map((role) => (
                          <SelectItem value={role}>
                            {formatString(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionalId"
                key="optionalId"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optional ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc123"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      This is an optional Id that can help identify the user
                      with an ID other than their email. This is recommended
                      especially if emails are hashed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loading /> : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnrollUser;
