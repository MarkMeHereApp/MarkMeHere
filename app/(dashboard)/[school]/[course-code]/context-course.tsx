'use client';

import * as React from 'react';
import { useState } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useParams } from 'next/navigation';

interface CourseContextType {
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourseMembers: CourseMember[];
  setUserCourseMembers: React.Dispatch<React.SetStateAction<CourseMember[]>>;
  selectedCourseId: string;
  selectedCourseRole: string;
  selectedCourseEnrollment: ({ course: Course } & CourseMember) | null;
  courseMembersOfSelectedCourse: CourseMember[] | null;
  setCourseMembersOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
}

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMembers: [],
  setUserCourseMembers: () => {},
  selectedCourseId: '',
  selectedCourseRole: '',
  selectedCourseEnrollment: null,
  courseMembersOfSelectedCourse: [],
  setCourseMembersOfSelectedCourse: () => {}
});

export default function CoursesContext({
  userCourses: initialUserCourses,
  userCourseMembers: initialUserCourseMembers,
  selectedCourseEnrollment: initialSelectedCourseEnrollment,
  children
}: {
  userCourses: Course[];
  userCourseMembers: CourseMember[];
  selectedCourseEnrollment: { course: Course } & CourseMember;
  children?: React.ReactNode;
}) {
  const [userCourses, setUserCourses] = useState<Course[]>(initialUserCourses);
  const [userCourseMembers, setUserCourseMembers] = useState<CourseMember[]>(
    initialUserCourseMembers
  );

  const [selectedCourseEnrollment] = useState<
    | ({
        course: Course;
      } & CourseMember)
    | null
  >(initialSelectedCourseEnrollment);

  if (!selectedCourseEnrollment) {
    throw new Error('No course found');
  }

  const [selectedCourseId] = useState<string>(
    selectedCourseEnrollment.course.id
  );

  const [selectedCourseRole] = useState<string>(selectedCourseEnrollment.role);

  const [courseMembersOfSelectedCourse, setCourseMembersOfSelectedCourse] =
    useState<CourseMember[] | null>(null);

  const courseMembers = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourseEnrollment.course.id
    },
    {
      onSuccess: (data) => {
        if (!data || !data.courseMembers) return;
        setCourseMembersOfSelectedCourse(data.courseMembers);
      }
    }
  );

  if (courseMembers.error) {
    throw courseMembers.error;
  }

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMembers,
        setUserCourseMembers,
        selectedCourseId,
        selectedCourseRole,
        selectedCourseEnrollment,
        courseMembersOfSelectedCourse,
        setCourseMembersOfSelectedCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => React.useContext(CourseContext);
