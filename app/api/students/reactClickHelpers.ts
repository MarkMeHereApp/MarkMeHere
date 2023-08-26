import {
  addStudent,
  deleteAllStudents,
  getStudents
} from '@/app/api/students/clientRequests';

import { SetStateAction } from 'react';
import { Student } from '@/utils/sharedTypes';

export const handleGetStudentsClick = async (
  setStudents: React.Dispatch<SetStateAction<Student[]>>
) => {
  const studentsData = await getStudents(); // You need to define or import the getStudents function
  setStudents(studentsData);
};

export const handleAddStudentClick = async (
  setStudents: React.Dispatch<SetStateAction<Student[]>>,
  newStudent: Student
) => {
  const studentsData = await addStudent(newStudent);
  console.log('test');
  console.log(studentsData);
  setStudents(studentsData);
};

export const handleDeleteAllStudentsClick = async (
  setStudents: React.Dispatch<SetStateAction<Student[]>>
) => {
  try {
    const studentsData = await deleteAllStudents();
    if (studentsData) {
      setStudents(studentsData);
    }
  } catch (error) {
    console.error('Error deleting students:', error);
  }
};
