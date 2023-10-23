'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useParams } from 'next/navigation';

interface CourseContextType {
  userCourses: Course[] | null;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[] | null>>;
  userCourseMembers: CourseMember[] | null;
  setUserCourseMembers: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedCourseId: string;
  selectedCourseRole: string | null;
  courseMembersOfSelectedCourse: CourseMember[] | null;
  setCourseMembersOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedAttendanceDate: Date;
  setSelectedAttendanceDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMembers: [],
  setUserCourseMembers: () => {},
  selectedCourseId: '',
  selectedCourseRole: null,
  courseMembersOfSelectedCourse: [],
  setCourseMembersOfSelectedCourse: () => {},
  selectedAttendanceDate: new Date(new Date().setHours(0, 0, 0, 0)),
  setSelectedAttendanceDate: () => {}
});

export default function CoursesContext({
  userCourses: initialUserCourses,
  userCourseMembers: initialUserCourseMembers,
  children
}: {
  userCourses?: Course[];
  userCourseMembers?: CourseMember[];
  children?: React.ReactNode;
}) {
  const params = useParams();

  const [userCourses, setUserCourses] = useState<Course[] | null>(
    initialUserCourses || null
  );
  const [userCourseMembers, setUserCourseMembers] = useState<
    CourseMember[] | null
  >(initialUserCourseMembers || null);

  const selectedCourseCode = Array.isArray(params['course-code'])
    ? params['course-code'][0]
    : params['course-code'];

  if (!selectedCourseCode) {
    throw new Error('No course code provided');
  }

  const [selectedCourseId, setSelectedCourseId] =
    useState<string>(selectedCourseCode);

  const [selectedCourseRole, setSelectedCourseRole] = useState<string | null>(
    null
  );

  const [courseMembersOfSelectedCourse, setCourseMembersOfSelectedCourse] =
    useState<CourseMember[] | null>(null);

  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );

  const [queryEnabled, setQueryEnabled] = useState<boolean>(false);

  const selectedCourseIdFromParam = userCourses?.find(
    (course) => course.courseCode === selectedCourseCode
  )?.id;

  if (!selectedCourseIdFromParam) {
    throw new Error('No course id found');
  }

  const courseMembers = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourseIdFromParam
    },
    {
      enabled: queryEnabled,
      onSuccess: (data) => {
        if (!data || !data.courseMembers) return;
        setCourseMembersOfSelectedCourse(data.courseMembers);
        setSelectedCourseRole(data?.courseMembership.role ?? null);
      }
    }
  );

  if (courseMembers.error) {
    throw courseMembers.error;
  }

  useEffect(() => {
    if (selectedCourseId) {
      setCourseMembersOfSelectedCourse(null);
      if (selectedCourseIdFromParam) {
        setSelectedCourseId(selectedCourseIdFromParam);
        setQueryEnabled(true);
        courseMembers.refetch();
      }
    }
  }, [selectedCourseCode]);

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMembers,
        setUserCourseMembers,
        selectedCourseId,
        selectedCourseRole,
        courseMembersOfSelectedCourse,
        setCourseMembersOfSelectedCourse,
        selectedAttendanceDate,
        setSelectedAttendanceDate
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => React.useContext(CourseContext);
