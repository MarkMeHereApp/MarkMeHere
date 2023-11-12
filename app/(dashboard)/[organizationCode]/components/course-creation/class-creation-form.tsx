'use client';
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
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
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
import { useRouter } from 'next/navigation';
import { syncCanvasCourseMembers } from '@/data/canvas/canvas-sync';
import { ConfigureCanvasUserDialog } from '../../(user)/components/canvas/canvas-submission-dialog';
import { hasCanvasConfigured } from '@/data/user/canvas';
import { Icons } from '@/components/ui/icons';
import { SkeletonButtonText } from '@/components/skeleton/skeleton-button';
import Link from 'next/link';

const CreateCourseFormSchema = z.object({
  courseCode: z
    .string()
    .min(2, {
      message: 'Course Label must be at least 2 characters.'
    })
    .max(255, {
      message: 'Course Label must not be longer than 255 characters.'
    })
    .refine((value) => /^[A-Za-z0-9\-]+$/.test(value), {
      message:
        'Course Label can only contain letters, numbers, and dashes ("-")'
    })
    .transform((val) => val.trim())
    .transform((val) => val.toLowerCase()),
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

enum CanvasConfigStatus {
  Loading = 'Loading',
  Configured = 'Configured',
  NotConfigured = 'NotConfigured'
}

export default function CreateCourseForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const [canvasConfigStatus, setCanvasConfigStatus] =
    useState<CanvasConfigStatus>(CanvasConfigStatus.Loading);

  const [loading, setLoading] = useState(false);
  const [getLMSSelectedCourse, setLMSSelectedCourse] =
    useState<zLMSCourseSchemeType | null>(null);

  const session = useSession();
  const createCourseMutation = trpc.course.createCourse.useMutation();
  const { setUserCourses, setUserCourseMembers, currentCourseUrl } =
    useCourseContext();
  const { organizationUrl, organization } = useOrganizationContext();
  const [error, setError] = useState<Error | null>(null);
  const utils = trpc.useContext();
  const router = useRouter();

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
          organizationCode: organization.uniqueCode,
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

      let canvasString = '';
      if (handleCreateCourseResult.resCourse.lmsId) {
        const { createdUsers } = await syncCanvasCourseMembers(
          newCourse.courseCode
        );

        if (createdUsers.length > 0) {
          canvasString = `Created ${createdUsers.length} new users in Canvas.`;
        }
      }

      setUserCourses((userCourses) => [...(userCourses || []), newCourse]);
      if (newEnrollment === null) {
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newCourse.name} has been created but you have not been enrolled to the course. ${canvasString}`,
          icon: 'success'
        });
      } else {
        setUserCourseMembers((prevMembers) => [
          ...(prevMembers || []),
          newEnrollment
        ]);
        toast({
          title: `${newCourse.name} Added Successfully!`,
          description: `${newEnrollment.name} have been enrolled to the course ${newCourse.name} as a ${newEnrollment.role}. ${canvasString}`,
          icon: 'success'
        });
      }
      utils.canvas.getCanvasCourses.invalidate();
      onSuccess();
      setLoading(false);
      router.refresh();
      router.push(`${organizationUrl}/${newCourse.courseCode}`);

      return;
    } catch (error) {
      setError(error as Error);
      return;
    }
  }

  useEffect(() => {
    if (getLMSSelectedCourse) {
      if (getLMSSelectedCourse.course_code) {
        const courseCode = getLMSSelectedCourse.course_code
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase();
        form.setValue('courseCode', courseCode);
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

  // This should be handled in a server component but I am too tired to care.
  useEffect(() => {
    const checkCanvasConfigured = async () => {
      if (
        organization.canvasDevKeyAuthorizedEmail === session.data?.user.email
      ) {
        const isCanvasConfigured = await hasCanvasConfigured();
        if (isCanvasConfigured) {
          setCanvasConfigStatus(CanvasConfigStatus.Configured);
        } else {
          setCanvasConfigStatus(CanvasConfigStatus.NotConfigured);
        }
      }
    };

    checkCanvasConfigured();
  }, [organization.canvasDevKeyAuthorizedEmail, session.data?.user.email]);

  const CanvasComponent = () => {
    if (canvasConfigStatus === CanvasConfigStatus.Configured) {
      return <LMSCourseSelector setSelectedLMSCourse={setLMSSelectedCourse} />;
    }

    if (canvasConfigStatus === CanvasConfigStatus.NotConfigured) {
      return (
        <Link href={`${organizationUrl}/user-settings`}>
          <Button variant={'outline'}>
            <Icons.canvas className="h-6 w-6 text-destructive " />
            <span className={` whitespace-nowrap ml-2 md:flex `}>
              Configure Canvas To Import
            </span>
          </Button>
        </Link>
      );
    }

    return <></>;
  };

  return session.status === 'loading' ? (
    <Loading />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CanvasComponent />
        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unique Course Code</FormLabel>
              <FormControl>
                <Input placeholder="cop4935-23fall-0002" {...field} />
              </FormControl>
              <FormDescription>
                This is your course code, it must be <b>unique</b>. We recommend
                referencing the term, year, and section.
                <i> Note, the label will be converted to all lowercase.</i>
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
                <FormLabel>Auto Enroll into class as a Teacher.</FormLabel>
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
