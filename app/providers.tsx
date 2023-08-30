'use client';

import { createContext, useEffect, useMemo, useState } from 'react';

import { SessionProvider } from 'next-auth/react';
import { Student } from '@/utils/sharedTypes';
import { Toaster } from '@/components/ui/toaster';
import { studentDataAPI } from './api/students/studentDataAPI';

type Props = {
  children?: React.ReactNode;
};

type StudentDataContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

export const StudentDataContext = createContext<StudentDataContextType>({
  students: [],
  setStudents: () => {}
});

export const Providers = ({ children }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchData = async () => {
    try {
      await studentDataAPI(students, setStudents).getStudents();
      console.log(students);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const memoizedValue = useMemo(
    () => ({ students, setStudents }),
    [students, setStudents]
  );

  return (
    <>
      <StudentDataContext.Provider value={memoizedValue}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </StudentDataContext.Provider>
    </>
  );
};

export default Providers;
