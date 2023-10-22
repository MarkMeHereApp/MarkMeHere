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
  selectedCourseId: string | null;
  setSelectedCourseId: React.Dispatch<React.SetStateAction<string | null>>;

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
  selectedCourseId: null,
  setSelectedCourseId: () => {},
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

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    selectedCourseCode || null
  );

  const [selectedCourseRole, setSelectedCourseRole] = useState<string | null>(
    null
  );

  const [courseMembersOfSelectedCourse, setCourseMembersOfSelectedCourse] =
    useState<CourseMember[] | null>(null);

  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );

  //This should only be called when we know the user is a professor or TA
  const courseMembers = trpc.courseMember.getCourseMembersOfCourse.useQuery(
    {
      courseId: selectedCourseId || ''
    },
    {
      enabled: !!selectedCourseId,
      onSuccess: (data) => {
        if (!data) return;
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
      const course = userCourses?.find(
        (course) => course.courseCode === selectedCourseCode
      );
      setCourseMembersOfSelectedCourse(null);
      if (course) {
        setSelectedCourseId(course.id);
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
        setSelectedCourseId,
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
