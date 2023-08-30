import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import * as z from 'zod';

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
import { Course } from '@/utils/sharedTypes';
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

export default function CreateCourseForm() {
  const session = useSession();

  const form = useForm<Course>({
    resolver: zodResolver(CreateCourseFormSchema),
    mode: 'onChange'
  });

  async function createCourse(data: Course): Promise<string> {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const course = await response.json();

      toast({
        title: 'Course Added Successfully',
        description: `Welcome to ${course.course.name}!`
      });

      // Assuming the course object has an id property
      return course.course.id;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error creating course',
        description: message
      });

      // Return an empty string or any other default value in case of an error
      return '';
    }
  }

  async function enrollProfessor(courseId: string, email: string) {
    const enrollmentData = {
      courseId: courseId,
      email: email,
      role: 'professor'
    };

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enrollmentData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const enrollment = await response.json();

      toast({
        title: 'Professor Enrolled Successfully',
        description: `Professor with email ${email} has been enrolled to the course with ID ${courseId}!`
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error enrolling professor',
        description: message
      });
    }
  }

  async function onSubmit(data: Course) {
    const sessionData = session.data;
    if (sessionData && sessionData.user?.email) {
      const courseId = await createCourse(data);
      if (courseId != '') {
        enrollProfessor(courseId, sessionData.user?.email);
      }
    }
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
              <FormLabel>Learning Management System ID</FormLabel>
              <FormControl>
                <Input className="resize-none" {...field} />
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
