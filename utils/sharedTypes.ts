export enum Role {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  password?: string;
}

export interface Lecture {}

export interface AttendanceEntry {}

export interface Course {
  courseId: string;
}

export interface CourseMember {
  id: string;
  lmsId?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  course?: Course;
  role: Role | string;
  dateCreated: Date | null;
  courseId: string;
  // attendanceEntries: AttendanceEntry[];
}

export interface Student extends CourseMember {
  role: 'STUDENT' | string;
}
export interface Professor extends CourseMember {
  role: 'PROFESSOR' | string;
}

export const GlobalDevCourseId = 'Bruh-Aldrich-2023';
