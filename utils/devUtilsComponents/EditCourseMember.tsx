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
import { zCourseRoles } from '@/types/sharedZodTypes';
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
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
import { MdEdit } from 'react-icons/md';
import { CourseMember } from '@prisma/client';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { isEmailHashed } from '@/server/utils/userHelpers';

const EditCourseMember = ({ courseMember }: { courseMember: CourseMember }) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const updateMember = trpc.courseMember.updateCourseMember.useMutation();
  const { setCourseMembersOfSelectedCourse } = useCourseContext();
  const [error, setError] = useState<Error | null>(null);

  const zCourseMember = z.object({
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
    role: zCourseRoles.optional()
  });

  type CourseMemberFormProps = z.infer<typeof zCourseMember>;

  const form = useForm<CourseMemberFormProps>({
    resolver: zodResolver(zCourseMember)
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
      const response = await updateMember.mutateAsync({
        id: courseMember.id,
        email: courseMember.email,
        name: data.name,
        role: data.role
      });

      setCourseMembersOfSelectedCourse((prevData) =>
        prevData
          ? prevData.map((user) =>
              user.id === response.member.id ? response.member : user
            )
          : [response.member]
      );

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
            <DialogTitle>Modify Course Member</DialogTitle>
            <DialogDescription>
              Modify the course member and click submit when you're done.
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
                        defaultValue={courseMember.name || ''}
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
                          defaultValue={
                            isEmailHashed(courseMember.email)
                              ? 'example@example.com'
                              : courseMember.email
                          }
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
                      defaultValue={courseMember.role}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {zCourseRoles.options.map((role) => (
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

export default EditCourseMember;
