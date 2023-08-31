import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { useState } from 'react';

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
import { Course, CourseMember } from '@/utils/sharedTypes';
import { toast } from '@/components/ui/use-toast';
import { string } from 'prop-types';

const CreateCourseFormSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: 'Course Name must be at least 4 characters.'
    })
    .max(30, {
      message: 'Course Name must not be longer than 30 characters.'
    })
    .refine((value) => !/[!@#\$%\^&\*]/.test(value), {
      message: 'Course Name cannot contain special characters (!@#$%^&*)'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Name cannot contain double spaces'
    }),
  lmsId: z
    .string()
    .max(255, {
      message:
        'Learning Management System ID must not be longer than 255 characters.'
    })
    .optional()
});

export default function CreateCourseForm({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const session = useSession();

  const form = useForm<Course>({
    resolver: zodResolver(CreateCourseFormSchema),
    mode: 'onChange'
  });

  async function createCourse(
    data: Course,
    bShouldEnroll: boolean,
    userFullName: string | null | undefined,
    email: string,
    role: string
  ): Promise<{ newCourse: Course | null; newEnrollment: CourseMember | null }> {
    try {
      const response: Response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseData: data,
          enroll: bShouldEnroll,
          email: email,
          name: userFullName,
          role: role
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      const resCourse = res.resCourse;
      const resEnrollment = res.resEnrollment;

      // Return the course object instead of just the id
      return { newCourse: resCourse, newEnrollment: resEnrollment };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error creating course',
        icon: 'error',
        description: message
      });

      // Return null in case of an error
      return { newCourse: null, newEnrollment: null }; // or replace null with a default CourseMember object
    }
  }

  async function onSubmit(course: Course) {
    setLoading(true);
    const sessionData = session.data;
    if (sessionData && sessionData.user?.email) {
      const { newCourse, newEnrollment } = await createCourse(
        course,
        true,
        sessionData.user?.name,
        sessionData.user?.email,
        'professor'
      );

      if (newCourse !== null && newCourse !== undefined) {
        if (newEnrollment !== null && newEnrollment !== undefined) {
          console.log(newCourse);
          toast({
            title: `${newCourse.name} Added Successfully!`,
            description: `${newEnrollment.name} have been enrolled to the course ${course.name} as a ${newEnrollment.role}!`,
            icon: 'success'
          });
        } else {
          toast({
            title: `${newCourse.name} Added Successfully!`,
            description: `${course.name} has been created but you have not been enrolled to the course.`,
            icon: 'success'
          });
        }
        setLoading(false);
        onSuccess();
        return;
      }

      toast({
        title: `ERROR: Course and CourseMember Undefined/Null!`
      });
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="COP 4256" {...field} />
              </FormControl>
              <FormDescription>
                This is your course name. It must be unique.
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
              <FormLabel>
                Course Learning Management System ID (optional)
              </FormLabel>
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
                but must be unique.
              </FormDescription>
              <FormMessage />
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
