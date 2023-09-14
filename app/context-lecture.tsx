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
}

const LecturesContext = createContext<LecturesContextType>({
  lectures: null,
  setLectures: () => {}
});

export default function LecturesContextProvider({
  children
}: {
  children?: React.ReactNode;
}) {
  const [lectures, setLectures] = useState<lecturesType>(null);

  const { selectedCourseId } = useCourseContext(); // Retrieve selectedCourseId from CourseContext

  const newLectureData = trpc.lecture.getAllLecturesAndAttendance.useQuery(
    {
      courseId: selectedCourseId || ''
    },
    {
      enabled: !!selectedCourseId, // The query will only run if selectedCourseId is not null
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
      newLectureData.refetch();
    }
  }, [selectedCourseId]);

  // Fetch lectures and attendance entries here
  // Update the state using setLectures and setAttendanceEntries

  return (
    <LecturesContext.Provider
      value={{
        lectures,
        setLectures
      }}
    >
      {children}
    </LecturesContext.Provider>
  );
}

export const useLecturesContext = () => React.useContext(LecturesContext);
