import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/app/_trpc/client';
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
import { Course, CourseMember } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';

const CreateCourseFormSchema = z.object({
  courseLabel: z
    .string()
    .min(2, {
      message: 'Course Label must be at least 2 characters.'
    })
    .max(30, {
      message: 'Course Label must not be longer than 30 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Label cannot contain double spaces'
    })
    .transform((val) => val.trim())
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .min(2, {
      message: 'Course Name must be at least 2 characters.'
    })
    .max(30, {
      message: 'Course Name must not be longer than 30 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Name cannot contain double spaces'
    })
    .transform((val) => val.trim()),
  lmsId: z
    .string()
    .min(2, {
      message: 'Learning Management System ID must be at least 2 characters.'
    })
    .max(255, {
      message:
        'Learning Management System ID must not be longer than 255 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Learning Management System ID contain double spaces'
    })
    .transform((val) => val.trim())
    .optional(),
  autoEnroll: z.boolean().default(true).optional()
});

export default function CreateCourseForm({
  onSuccess
}: {
  onSuccess: (
    newCourse: Course,
    newCourseMembership: CourseMember | null
  ) => void;
}) {
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const createCourseMutation = trpc.course.createCourse.useMutation();

  type CourseFormInput = Course & {
    autoEnroll: boolean;
  };

  const form = useForm<CourseFormInput>({
    resolver: zodResolver(CreateCourseFormSchema),
    mode: 'onChange',
    defaultValues: {
      autoEnroll: true
    }
  });

  async function onSubmit(courseform: CourseFormInput) {
    setLoading(true);
    const sessionData = session.data;
    if (!sessionData) {
      setLoading(false);
      throw new Error('Session data is undefined, ');
    }

    const userFullName = sessionData?.user?.name;
    const userEmail = sessionData?.user?.email;
    if (!userFullName || !userEmail) {
      setLoading(false);
      throw new Error('User name or email is undefined, ');
    }

    const handleCreateCourse = async () => {
      return await createCourseMutation.mutateAsync({
        newCourseData: {
          courseLabel: courseform.courseLabel,
          name: courseform.name,
          lmsId: courseform.lmsId || undefined
        },
        autoEnroll: courseform.autoEnroll,
        newMemberData: {
          email: userEmail,
          name: userFullName,
          role: 'professor'
        }
      });
    };

    try {
      const handleCreateCourseResult = await handleCreateCourse();

      if (handleCreateCourseResult.success === false) {
        setLoading(false);
        throw new Error('Unexpected server error.');
      }

      const newEnrollment = handleCreateCourseResult.resEnrollment;
      const newCourse = handleCreateCourseResult.resCourse;

      if (newEnrollment === null) {
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newCourse.name} has been created but you have not been enrolled to the course.`,
          icon: 'success'
        });
      } else {
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newEnrollment.name} have been enrolled to the course ${newCourse.name} as a ${newEnrollment.role}!`,
          icon: 'success'
        });
      }

      onSuccess(newCourse, newEnrollment);
      setLoading(false);
      return;
    } catch (error) {
      setLoading(false);
      throw new Error('Unexpected server error.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique Course Label</FormLabel>
              <FormControl>
                <Input placeholder="COP4935-23FALL 0002" {...field} />
              </FormControl>
              <FormDescription>
                This is your course label, it must be <b>unique</b>. We
                recommend referencing the term, year, and section.
                <i> Note, the label will be converted to all uppercase.</i>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Senior Design 2 Mo/We" {...field} />
              </FormControl>
              <FormDescription>
                This is your course's user-friendly display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lmsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Management System ID (optional)</FormLabel>
              <FormControl>
                <Input
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                This is your course's Learning Management System ID (like Canvas
                or Moodle). This can help organize your courses. It is optional,
                but it must be unique.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoEnroll"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Auto Enroll into class as Professor.</FormLabel>
                <FormDescription>
                  @TODO This option should only be visible for admins
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
