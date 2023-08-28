import { Student } from '@/utils/sharedTypes';

export const studentDataAPI = (
  students: Student[],
  setStudents: (students: Student[]) => void
) => {
  const getStudents = async () => {
    try {
      const response = await fetch('/api/students', {
        method: 'GET'
      });

      if (response.ok) {
        const responseData: { students: Student[] } = await response.json();
        const students = responseData.students;
        return students;
      } else {
        console.error('Failed to fetch data:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        body: JSON.stringify(student)
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
      const response = await fetch('/api/students', {
        method: 'DELETE',
        body: JSON.stringify(students)
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
      const response = await fetch('/api/students', {
        method: 'DELETE',
        body: JSON.stringify(studentArray)
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
