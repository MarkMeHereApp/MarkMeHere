'use client';

import * as React from 'react';
import { useState } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';

interface CourseContextType {
  userCourses: Course[] | null;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[] | null>>;
  userCourseMemberships: CourseMember[] | null;
  setuserCourseMemberships: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedCourseId: string | null;
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CourseContext = createContext<CourseContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMemberships: [],
  setuserCourseMemberships: () => {},
  selectedCourseId: null,
  setSelectedCourseId: () => {}
});

export default function CoursesContext({
  className,
  userCourses: initialUserCourses,
  userCourseMemberships: initialUserCourseMemberships,
  children
}: {
  className?: string;
  userCourses?: Course[];
  userCourseMemberships?: CourseMember[];
  children?: React.ReactNode;
}) {
  const [userCourses, setUserCourses] = useState<Course[] | null>(
    initialUserCourses || null
  );
  const [userCourseMemberships, setuserCourseMemberships] = useState<
    CourseMember[] | null
  >(initialUserCourseMemberships || null);

  const initialSelectedCourseId = userCourses?.[0]?.id || null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialSelectedCourseId || null
  );

  return (
    <CourseContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMemberships,
        setuserCourseMemberships,
        selectedCourseId,
        setSelectedCourseId
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourseContext = () => React.useContext(CourseContext);
