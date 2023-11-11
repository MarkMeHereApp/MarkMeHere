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
  selectedCourse: Course;
  selectedCourseEnrollment: CourseMember | undefined;
  currentCourseUrl: string;
  courseMembersOfSelectedCourse: CourseMember[] | null;
  setCourseMembersOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
}

// This should never be used, but it's here to prevent errors
const defaultCourse: Course = {
  id: '',
  courseCode: '',
  organizationCode: '',
  name: '',
  lmsType: '',
  lmsId: null,
  dateCreated: new Date(),
  StartDate: null,
  EndDate: null,
  lmsAttendanceAssignmentId: null
};

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMembers: [],
  setUserCourseMembers: () => {},
  selectedCourseId: '',
  selectedCourse: defaultCourse,
  selectedCourseEnrollment: undefined,
  currentCourseUrl: '',
  courseMembersOfSelectedCourse: [],
  setCourseMembersOfSelectedCourse: () => {}
});

export default function CoursesContext({
  userCourses: initialUserCourses,
  userCourseMembers: initialUserCourseMembers,
  selectedCourse: initialSelectedCourse,
  selectedCourseEnrollment: initialSelectedCourseEnrollment,
  children
}: {
  userCourses: Course[];
  userCourseMembers: CourseMember[];
  selectedCourse: Course;
  selectedCourseEnrollment: CourseMember | undefined;
  children?: React.ReactNode;
}) {
  const { organization } = useOrganizationContext();

  const [userCourses, setUserCourses] = useState<Course[]>(initialUserCourses);
  const [userCourseMembers, setUserCourseMembers] = useState<CourseMember[]>(
    initialUserCourseMembers
  );

  const [selectedCourse] = useState<Course>(initialSelectedCourse);

  const [selectedCourseEnrollment] = useState<CourseMember | undefined>(
    initialSelectedCourseEnrollment
  );

  const [currentCourseUrl] = useState<string>(
    `/${organization.uniqueCode}/${selectedCourse.courseCode}`
  );

  if (!selectedCourse || selectedCourse.id === '') {
    throw new Error('No course found');
  }

  const [selectedCourseId] = useState<string>(selectedCourse.id);

  const [courseMembersOfSelectedCourse, setCourseMembersOfSelectedCourse] =
    useState<CourseMember[] | null>(null);

  const courseMembers = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourse.id
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
        selectedCourse,
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
