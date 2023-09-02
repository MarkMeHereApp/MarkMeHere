'use client';

import * as React from 'react';
import { useState } from 'react';

import { Course, CourseMember } from '@prisma/client';
import { createContext } from 'react';

interface GlobalContextType {
  userCourses: Course[] | null;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[] | null>>;
  userCourseMemberships: CourseMember[] | null;
  setuserCourseMemberships: React.Dispatch<
    React.SetStateAction<CourseMember[] | null>
  >;
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  selectedCourseMember: CourseMember | null;
  setSelectedCourseMember: React.Dispatch<
    React.SetStateAction<CourseMember | null>
  >;
}

const GlobalContext = createContext<GlobalContextType>({
  userCourses: [],
  setUserCourses: () => {},
  userCourseMemberships: [],
  setuserCourseMemberships: () => {},
  selectedCourse: null,
  setSelectedCourse: () => {},
  selectedCourseMember: null,
  setSelectedCourseMember: () => {}
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

  const initialSelectedCourse = userCourses?.[0] || null;

  const initialSelectedCourseMember = userCourseMemberships?.[0] || null;

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    initialSelectedCourse || null
  );
  const [selectedCourseMember, setSelectedCourseMember] =
    useState<CourseMember | null>(initialSelectedCourseMember || null);

  return (
    <GlobalContext.Provider
      value={{
        userCourses,
        setUserCourses,
        userCourseMemberships,
        setuserCourseMemberships,
        selectedCourse,
        setSelectedCourse,
        selectedCourseMember,
        setSelectedCourseMember
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => React.useContext(GlobalContext);
