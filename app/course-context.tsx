'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';

interface CourseContextType {
  userCourses: Course[] | null;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[] | null>>;
  userCourseMemberships: CourseMember[] | null;
  setuserCourseMemberships: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedCourseId: string | null;
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string | null>>;
  courseMembershipsOfSelectedCourse: CourseMember[] | null;
  setCourseMembershipsOfSelectedCourse: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
}

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMemberships: [],
  setuserCourseMemberships: () => {},
  selectedCourseId: null,
  setSelectedCourseId: () => {},
  courseMembershipsOfSelectedCourse: [],
  setCourseMembershipsOfSelectedCourse: () => {}
});

export default function CoursesContext({
  className,
  userCourses: initialUserCourses,
  userCourseMemberships: initialUserCourseMemberships,
  userSelectedCourseId: initialSelectedCourseId,
  children
}: {
  className?: string;
  userCourses?: Course[];
  userCourseMemberships?: CourseMember[];
  userSelectedCourseId?: string | null;
  children?: React.ReactNode;
}) {
  const [userCourses, setUserCourses] = useState<Course[] | null>(
    initialUserCourses || null
  );
  const [userCourseMemberships, setuserCourseMemberships] = useState<
    CourseMember[] | null
  >(initialUserCourseMemberships || null);

  const courseId = initialSelectedCourseId || userCourses?.[0]?.id || null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    courseId
  );

  const [
    courseMembershipsOfSelectedCourse,
    setCourseMembershipsOfSelectedCourse
  ] = useState<CourseMember[] | null>(null);

  const courseMembers: {
    data: CourseMember[] | null | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  } = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourseId as any
    },
    {
      enabled: !!selectedCourseId, // The query will only run if selectedCourseId is not null
      onSuccess: (data: CourseMember[]) => {
        if (!data) return;
        setCourseMembershipsOfSelectedCourse(data);
      }
    }
  );

  useEffect(() => {
    if (
      selectedCourseId &&
      !(courseMembershipsOfSelectedCourse?.[0]?.courseId === selectedCourseId)
    ) {
      setCourseMembershipsOfSelectedCourse(null);
      courseMembers.refetch();
    }
  }, [selectedCourseId]);

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMemberships,
        setuserCourseMemberships,
        selectedCourseId,
        setSelectedCourseId,
        courseMembershipsOfSelectedCourse,
        setCourseMembershipsOfSelectedCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => React.useContext(CourseContext);
