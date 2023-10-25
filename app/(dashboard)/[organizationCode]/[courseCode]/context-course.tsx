'use client';

import * as React from 'react';
import { useState } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useParams } from 'next/navigation';
import { useOrganizationContext } from '../context-organization';

interface CourseContextType {
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourseMembers: CourseMember[];
  setUserCourseMembers: React.Dispatch<React.SetStateAction<CourseMember[]>>;
  selectedCourseId: string;
  selectedCourseRole: string;
  selectedCourseEnrollment: { course: Course } & CourseMember;
  currentCourseUrl: string;
  courseMembersOfSelectedCourse: CourseMember[] | null;
  setCourseMembersOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
}

// This should never be used, but it's here to prevent errors
const defaultCourseEnrollment: { course: Course } & CourseMember = {
  id: '',
  optionalId: null,
  lmsId: null,
  email: '',
  name: '',
  courseId: '',
  dateEnrolled: new Date(),
  role: '',
  course: {
    id: '',
    courseCode: '',
    name: '',
    lmsType: '',
    lmsId: null,
    dateCreated: new Date(),
    StartDate: null,
    EndDate: null
  }
};

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMembers: [],
  setUserCourseMembers: () => {},
  selectedCourseId: '',
  selectedCourseRole: '',
  selectedCourseEnrollment: defaultCourseEnrollment,
  currentCourseUrl: '',
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
  const { organization } = useOrganizationContext();

  const [userCourses, setUserCourses] = useState<Course[]>(initialUserCourses);
  const [userCourseMembers, setUserCourseMembers] = useState<CourseMember[]>(
    initialUserCourseMembers
  );

  const [selectedCourseEnrollment] = useState<
    {
      course: Course;
    } & CourseMember
  >(initialSelectedCourseEnrollment);

  const [currentCourseUrl] = useState<string>(
    `/${organization.uniqueCode}/${selectedCourseEnrollment.course.courseCode}`
  );

  if (!selectedCourseEnrollment || selectedCourseEnrollment.course.id === '') {
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
        currentCourseUrl,
        courseMembersOfSelectedCourse,
        setCourseMembersOfSelectedCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => React.useContext(CourseContext);
