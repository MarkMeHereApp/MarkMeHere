import { Student } from '@/utils/sharedTypes';

export const getStudents = async () => {
  try {
    const response = await fetch('/api/students', {
      method: 'GET'
    });

    if (response.ok) {
      const responseData: { students: Student[] } = await response.json(); // Use the correct type here
      const students = responseData.students;
      console.log(students);
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

export const addRandomStudent = async () => {
  try {
    const response = await fetch('/api/students', {
      method: 'POST'
    });

    if (response.ok) {
      const responseData: { students: Student[] } = await response.json(); // Use the correct type here
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

export const deleteAllStudents = async () => {
  try {
    const response = await fetch('/api/students', {
      method: 'DELETE'
    });

    if (response.ok) {
      const responseData: { students: Student[] } = await response.json(); // Use the correct type here
      const students = responseData.students;
      return students;
    } else {
      console.error('Error deleting students:', response.status);
    }
  } catch (error) {
    console.error('Error deleting students:', error);
  }
};
