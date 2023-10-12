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
import { z } from 'zod';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { useCourseContext } from '@/app/context-course';
import { trpc } from '@/app/_trpc/client';
import { toastSuccess } from '../globalFunctions';
import Loading from '@/components/general/loading';
import { zCourseRoles } from '@/types/sharedZodTypes';
import { formatString } from '../globalFunctions';

const EnrollCourseMemberButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {
    selectedCourseId,
    courseMembersOfSelectedCourse,
    setCourseMembersOfSelectedCourse
  } = useCourseContext();
  const [loading, setLoading] = useState(false);
  const createCourseMemberMutation =
    trpc.courseMember.createCourseMember.useMutation();

  if (error) {
    setLoading(false);
    throw error;
  }

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const zCourseMemberForm = z.object({
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
      .refine(
        (value) =>
          !courseMembersOfSelectedCourse?.some(
            (member) => member.email === value
          ),
        'Email is already in use in this course'
      )
      .refine((value) => value.trim() === value, {
        message: 'Value must not have leading or trailing spaces'
      }),
    role: zCourseRoles,
    optionalId: z
      .string()
      .max(255)
      .optional()
      .refine(
        (value) =>
          value === '' ||
          !courseMembersOfSelectedCourse?.some(
            (member) => member.optionalId === value
          ),
        'Optional ID is already in use in this course'
      )
      .refine(
        (value) => value === '' || (value ? value.trim() === value : true),
        {
          message: 'Value must not have leading or trailing spaces'
        }
      )
  });

  type CourseMemberFormProps = z.infer<typeof zCourseMemberForm>;

  const form = useForm<CourseMemberFormProps>({
    resolver: zodResolver(zCourseMemberForm)
  });

  async function onSubmit(data: CourseMemberFormProps) {
    const errorMessage = 'Failed to enroll course member';

    try {
      if (!selectedCourseId) throw new Error('No selected course');

      setLoading(true);
      const response = await createCourseMemberMutation.mutateAsync({
        ...data,
        courseId: selectedCourseId
      });

      if (!response.success) throw new Error(errorMessage);

      setCourseMembersOfSelectedCourse((prev) => {
        return prev
          ? [...prev, response.resEnrollment]
          : [response.resEnrollment];
      });

      setLoading(false);
      toastSuccess(`Successfully enrolled ${data.name} as a ${data.role}!`);
      handleDialogClose();
    } catch (error) {
      setError(error as Error);
    }
  }

  return selectedCourseId ? (
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
            <span className="whitespace-nowrap">Enroll</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader onClick={handleDialogClose}>
            <DialogTitle>Enroll Course Member</DialogTitle>
            <DialogDescription>
              Fill in the course member&apos;s information below and click
              enroll when you&apos;re done.
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
                        placeholder="Aldrich Agabin"
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
                defaultValue="student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="student"
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
                      This is an optional Id that can help identify the
                      courseMember with an ID other than their email. This is
                      recommended especially if emails are hashed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loading /> : 'Enroll Course Member'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default EnrollCourseMemberButton;
