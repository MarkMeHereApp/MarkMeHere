'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';

interface CourseContextType {
  userCourses: Course[] | null;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[] | null>>;
  userCourseMembers: CourseMember[] | null;
  setUserCourseMembers: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedCourseId: string | null;
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string | null>>;
  courseMembersOfSelectedCourse: CourseMember[] | null;
  setCourseMembersOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedAttendanceDate: Date | null;
  setSelectedAttendanceDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMembers: [],
  setUserCourseMembers: () => {},
  selectedCourseId: null,
  setSelectedCourseId: () => {},
  courseMembersOfSelectedCourse: [],
  setCourseMembersOfSelectedCourse: () => {},
  selectedAttendanceDate: null,
  setSelectedAttendanceDate: () => {}
});

export default function CoursesContext({
  className,
  userCourses: initialUserCourses,
  userCourseMembers: initialUserCourseMembers,
  userSelectedCourseId: initialSelectedCourseId,
  children
}: {
  className?: string;
  userCourses?: Course[];
  userCourseMembers?: CourseMember[];
  userSelectedCourseId?: string | null;
  children?: React.ReactNode;
}) {
  const [userCourses, setUserCourses] = useState<Course[] | null>(
    initialUserCourses || null
  );
  const [userCourseMembers, setUserCourseMembers] = useState<
    CourseMember[] | null
  >(initialUserCourseMembers || null);

  const courseId = initialSelectedCourseId || userCourses?.[0]?.id || null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    courseId
  );

  const [courseMembersOfSelectedCourse, setCourseMembersOfSelectedCourse] =
    useState<CourseMember[] | null>(null);

  const [selectedAttendanceDate, setSelectedAttendanceDate] =
    useState<Date | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedAttendanceDate(today);
  }, []);

  const courseMembers = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourseId || ''
    },
    {
      enabled: !!selectedCourseId, // The query will only run if selectedCourseId is not null
      onSuccess: (data) => {
        if (!data) return;
        setCourseMembersOfSelectedCourse(data.courseMembers);
      }
    }
  );

  if (courseMembers.error) {
    throw courseMembers.error;
  }

  useEffect(() => {
    if (
      selectedCourseId &&
      !(courseMembersOfSelectedCourse?.[0]?.courseId === selectedCourseId)
    ) {
      setCourseMembersOfSelectedCourse(null);
      courseMembers.refetch();
    }
  }, [selectedCourseId]);

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMembers,
        setUserCourseMembers,
        selectedCourseId,
        setSelectedCourseId,
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
