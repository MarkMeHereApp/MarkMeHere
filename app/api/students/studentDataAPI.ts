import { StudentResponse } from './route';
import { GlobalDevCourseId } from './../../../utils/sharedTypes';
import { Student } from '@/utils/sharedTypes';

export const studentDataAPI = (
  // pass in the StudentDataContext and CourseContext
  currentStudents: Student[],
  setStudents: (students: Student[]) => void
) => {
  const courseId = GlobalDevCourseId;
  const getStudents = async () => {
    try {
      const url = `/api/students?courseId=${courseId}`;
      const response = await fetch(url, {
        method: 'GET'
      });

      if (response.ok) {
        const responseData: StudentResponse = await response.json();
        const students = responseData.students;
        setStudents(students);
      } else {
        console.error('Failed to fetch data:', response.status);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStudents([]);
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const requestData = {
        student,
        courseId
      };
      const response = await fetch('/api/students', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        const responseData: { students: Student[] } = await response.json();
        const students = responseData.students;
        setStudents(students);
      } else {
        console.error('Failed to fetch data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteAllStudents = async (students: Student[]) => {
    try {
      const requestData = {
        students,
        courseId
      };
      const response = await fetch('/api/students', {
        method: 'DELETE',
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData: { students: Student[] } = await response.json();
        const students = responseData.students;
        setStudents(students);
      } else {
        console.error('Error deleting students:', response.status);
      }
    } catch (error) {
      console.error('Error deleting students:', error);
    }
  };

  const deleteStudent = async (student: Student) => {
    try {
      const studentArray = [student];
      const requestData = {
        students: studentArray,
        courseId
      };
      const response = await fetch('/api/students', {
        method: 'DELETE',
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData: { students: Student[] } = await response.json();
        const students = responseData.students;
        setStudents(students);
      } else {
        console.error('Error deleting student:', response.status);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return {
    getStudents,
    addStudent,
    deleteAllStudents,
    deleteStudent
  };
};
