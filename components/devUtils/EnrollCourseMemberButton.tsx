import { AiOutlineUserAdd } from 'react-icons/ai';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';

const EnrollCourseMemberButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedCourseId, setCourseMembersOfSelectedCourse } =
    useCourseContext();
  const createCourseMemberMutation =
    trpc.courseMember.createCourseMember.useMutation();
  const getCourseMembersOfCourseQuery =
    trpc.courseMember.getCourseMembersOfCourse.useQuery(
      {
        courseId: selectedCourseId || ''
      },
      {
        onSuccess: (data) => {
          if (!data) return;
          setCourseMembersOfSelectedCourse(data.courseMembers);
        }
      }
    );

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const zCourseMemberForm = z.object({
    name: z.string(),
    email: z.string(),
    role: z.string(),
    lmsId: z.string().nullable()
  });

  type CourseMemberFormProps = z.infer<typeof zCourseMemberForm>;

  const form = useForm<CourseMemberFormProps>({
    resolver: zodResolver(zCourseMemberForm)
  });

  async function onSubmit(data: CourseMemberFormProps) {
    const enrollCourseMember = async () => {
      let errorMessage = 'Failed to enroll course member';

      try {
        if (!selectedCourseId) throw new Error('No selected course');

        const response = await createCourseMemberMutation.mutateAsync({
          ...data,
          id: '',
          courseId: selectedCourseId,
          dateEnrolled: new Date()
        });

        if (!response.success) throw new Error(errorMessage);

        await getCourseMembersOfCourseQuery.refetch();
      } catch (error) {
        throw new Error(errorMessage);
      }
    };

    await enrollCourseMember();
    handleDialogClose();
  }

  return selectedCourseId ? (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => handleDialogOpen()}>
            <AiOutlineUserAdd className="h-4 w-4 mr-2" />
            Enroll New Course Member
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
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Name</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Aldrich Agabin" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        type="email"
                        placeholder="Richard.Leinecker@ucf.edu"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                defaultValue="student"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="student"
                    >
                      <FormControl className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="professor">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lmsId"
                defaultValue=""
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">
                      LMS ID (Optional)
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        placeholder="abc123"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Enroll Course Member</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default EnrollCourseMemberButton;
