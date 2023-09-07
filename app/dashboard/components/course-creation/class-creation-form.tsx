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
import { Course } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useCourseContext } from '@/app/course-context';
import { LMSCourseSelector } from './lms-course-selector';
import { zLMSCourseScheme, zLMSCourseSchemeType } from '@/types/sharedZodTypes';
import { useEffect } from 'react';
import { formatString } from '@/utils/globalFunctions';

const CreateCourseFormSchema = z.object({
  courseCode: z
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
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [getLMSSelectedCourse, setLMSSelectedCourse] =
    useState<zLMSCourseSchemeType | null>(null);
  const session = useSession();
  const createCourseMutation = trpc.course.createCourse.useMutation();
  const { setUserCourses, setUserCourseMembers, setSelectedCourseId } =
    useCourseContext();
  const utils = trpc.useContext();

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

    try {
      const handleCreateCourseResult = await createCourseMutation.mutateAsync({
        newCourseData: {
          courseCode: courseform.courseCode,
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

      if (handleCreateCourseResult.success === false) {
        setLoading(false);
        throw new Error('Unexpected server error.');
      }

      const newEnrollment = handleCreateCourseResult.resEnrollment;
      const newCourse = handleCreateCourseResult.resCourse;

      setUserCourses((userCourses) => [...(userCourses || []), newCourse]);
      setSelectedCourseId(newCourse.id);

      if (newEnrollment === null) {
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newCourse.name} has been created but you have not been enrolled to the course.`,
          icon: 'success'
        });
      } else {
        setUserCourseMembers((prevMembers) => [
          ...(prevMembers || []),
          newEnrollment
        ]);
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newEnrollment.name} have been enrolled to the course ${newCourse.name} as a ${newEnrollment.role}!`,
          icon: 'success'
        });
      }
      utils.canvas.getCanvasCourses.invalidate();
      onSuccess();
      setLoading(false);
      return;
    } catch (error) {
      setLoading(false);
      throw new Error('Unexpected server error.');
    }
  }

  useEffect(() => {
    if (getLMSSelectedCourse) {
      if (getLMSSelectedCourse.course_code) {
        form.setValue('courseCode', getLMSSelectedCourse.course_code);
      }
      if (getLMSSelectedCourse.name) {
        form.setValue('name', getLMSSelectedCourse.name);
      }
      if (getLMSSelectedCourse.lmsId) {
        form.setValue('lmsId', getLMSSelectedCourse.lmsId);
      }
    } else {
      form.setValue('courseCode', '');
      form.setValue('name', '');
      form.setValue('lmsId', null);
    }
  }, [getLMSSelectedCourse]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <LMSCourseSelector setSelectedLMSCourse={setLMSSelectedCourse} />

        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique Course Code</FormLabel>
              <FormControl>
                <Input placeholder="COP4935-23FALL 0002" {...field} />
              </FormControl>
              <FormDescription>
                This is your course code, it must be <b>unique</b>. We recommend
                referencing the term, year, and section.
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
              <FormDescription>
                <span>
                  {getLMSSelectedCourse &&
                    formatString(getLMSSelectedCourse.lmsType) + ' ID: '}
                  {field.value}
                </span>
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
