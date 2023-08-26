'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { SessionProvider } from 'next-auth/react';
import { Student } from '@/utils/sharedTypes';
import { Toaster } from '@/components/ui/toaster';
import { useStudentDataAPI } from './api/students/useStudentDataAPI';

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsData = await useStudentDataAPI(
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

  return (
    <>
      <StudentDataContext.Provider value={{ students, setStudents }}>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </StudentDataContext.Provider>
    </>
  );
};
