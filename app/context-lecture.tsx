'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Lecture, AttendanceEntry } from '@prisma/client';
import { createContext } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/context-course';

export type lecturesType =
  | ({ attendanceEntries: AttendanceEntry[] } & Lecture)[]
  | null;

interface LecturesContextType {
  lectures: lecturesType;
  setLectures: React.Dispatch<
    React.SetStateAction<
      ({ attendanceEntries: AttendanceEntry[] } & Lecture)[] | null
    >
  >;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

const LecturesContext = createContext<LecturesContextType>({
  lectures: null,
  setLectures: () => {},
  pageSize: 10,
  setPageSize: () => {}
});

export default function LecturesContextProvider({
  children
}: {
  children?: React.ReactNode;
}) {
  const [lectures, setLectures] = useState<lecturesType>(null);
  const [pageSize, setPageSize] = useState<number>(10); // Default page size is 10; will never be null

  const { selectedCourseId, selectedCourseRole } = useCourseContext(); // Retrieve selectedCourseId from CourseContext

  const newLectureData = trpc.lecture.getAllLecturesAndAttendance.useQuery(
    {
      courseId: selectedCourseId || ''
    },
    {
      /* 
        The query will only run if selectedCourseId is not null and the users course role is professor or TA
      */
      enabled: !!selectedCourseId,
      onSuccess: (data) => {
        if (!data) return;
        setLectures(data.lectures);
      }
    }
  );

  if (newLectureData.error) {
    throw newLectureData.error;
  }

  useEffect(() => {
    if (selectedCourseId) {
      setLectures(null);
      setPageSize(10);
      newLectureData.refetch();
    }
  }, [selectedCourseId]);

  // Fetch lectures and attendance entries here
  // Update the state using setLectures and setAttendanceEntries

  return (
    <LecturesContext.Provider
      value={{
        lectures,
        setLectures,
        pageSize,
        setPageSize
      }}
    >
      {children}
    </LecturesContext.Provider>
  );
}

export const useLecturesContext = () => React.useContext(LecturesContext);
