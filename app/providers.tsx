'use client';

import { createContext, useEffect, useState } from 'react';

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
      const studentsData = await studentDataAPI(
        students,
        setStudents
      ).getStudents();
      if (studentsData.length > 0) {
        setStudents(studentsData);
      } else {
        console.error('No user data received.');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <StudentDataContext.Provider value={{ students, setStudents }}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </StudentDataContext.Provider>
    </>
  );
};

export default Providers;
