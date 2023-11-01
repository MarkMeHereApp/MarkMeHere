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
import { useUsersContext } from '@/app/(dashboard)/[organizationCode]/(admin)/context-users';
import { MdEdit } from 'react-icons/md';
import { User } from 'next-auth';
const EditUsers = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateUser = trpc.user.updateUser.useMutation();
  const { userData, setUserData } = useUsersContext();
  const [error, setError] = useState<Error | null>(null);

  const zUsers = z.object({
    name: z
      .string()
      .min(1)
      .max(255)
      .optional()
      .refine((value) => value?.trim() === value, {
        message: 'Value must not have leading or trailing spaces'
      }),
    email: z
      .string()
      .min(1)
      .optional()
      .refine((value) => value?.trim() === value, {
        message: 'Value must not have leading or trailing spaces'
      }),
    role: zSiteRoles.optional(),
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

  type UsersFormProps = z.infer<typeof zUsers>;

  const form = useForm<UsersFormProps>({
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

  async function onSubmit(data: UsersFormProps) {
    try {
      setLoading(true);
      const response = await updateUser.mutateAsync({
        email: user.email,
        name: data.name,
        role: data.role,
        optionalId: data.optionalId
      });

      setUserData((prevData) => ({
        ...prevData,
        users: prevData.users
          ? prevData.users.map((user) =>
              user.email === response.user.email ? response.user : user
            )
          : [response.user]
      }));

      setLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      setError(error as Error);
    }
  }
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="p-2">
            <MdEdit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modify Site User</DialogTitle>
            <DialogDescription>
              Modify the user and click submit when you're done.
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
                key={'name'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        key={'nameInput'}
                        defaultValue={user.name || ''}
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
                  key={'email'}
                  disabled
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          defaultValue={user.email}
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
                key={'role'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={user.role}
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
                defaultValue={user.optionalId || ''}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optional ID</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
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
                  {loading ? <Loading /> : 'Submit'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUsers;
