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
import { useCourseContext } from '@/app/context-course';
import { LMSCourseSelector } from './lms-course-selector';
import {
  zLMSCourseSchemeType,
  zLMSProvider,
  zLMSProviderType,
  zCourseRoles
} from '@/types/sharedZodTypes';
import { useEffect } from 'react';
import { formatString, toastError } from '@/utils/globalFunctions';
import { TRPCClientError } from '@trpc/client';
import Loading from '@/components/general/loading';

const CreateCourseFormSchema = z.object({
  courseCode: z
    .string()
    .min(2, {
      message: 'Course Label must be at least 2 characters.'
    })
    .max(255, {
      message: 'Course Label must not be longer than 255 characters.'
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
    .max(255, {
      message: 'Course Name must not be longer than 255 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Name cannot contain double spaces'
    })
    .transform((val) => val.trim()),
  lmsId: z.string().optional().nullable(),
  lmsType: zLMSProvider,
  autoEnroll: z.boolean().default(true)
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
  const [error, setError] = useState<Error | null>(null);
  const utils = trpc.useContext();

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
      setError(new Error('SessionData is undefined.'));
      return;
    }

    const userFullName = sessionData?.user?.name;
    const userEmail = sessionData?.user?.email;
    if (!userFullName || !userEmail) {
      setError(new Error('User name or email is undefined.'));
      return;
    }

    try {
      const handleCreateCourseResult = await createCourseMutation.mutateAsync({
        newCourseData: {
          courseCode: courseform.courseCode,
          name: courseform.name,
          lmsId: courseform.lmsId || undefined,
          lmsType: courseform.lmsType as zLMSProviderType
        },
        autoEnroll: courseform.autoEnroll,
        newMemberData: {
          email: userEmail,
          name: userFullName,
          role: zCourseRoles.Enum.teacher
        }
      });

      if (!handleCreateCourseResult.resCourse) {
        setError(
          //prettier-ignore
          new Error('Unexpected server error: No course returned from createCourseMutation.')
        );
        return;
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
      setError(error as Error);
      return;
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
      if (getLMSSelectedCourse.lmsType) {
        form.setValue('lmsType', getLMSSelectedCourse.lmsType);
      }
    } else {
      form.setValue('courseCode', '');
      form.setValue('name', '');
      form.setValue('lmsId', null);
      form.setValue('lmsType', 'none');
    }
  }, [getLMSSelectedCourse]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {process.env.NEXT_PUBLIC_CANVAS_ENABLED && (
          <LMSCourseSelector setSelectedLMSCourse={setLMSSelectedCourse} />
        )}
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
          name="lmsType"
          render={({ field }) => <FormItem />}
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
          {loading ? <Loading /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
