export enum UserType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR'
}

export interface User {
  id: string;
  userType?: UserType;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateCreated: Date;

  password?: string;
  coursesAsStudent?: Course[];
  lecturesAttended?: Lecture[];
  attendanceEntries?: AttendanceEntry[];
}

export interface Student extends User {
  userType: UserType.STUDENT;
}

export interface Professor extends User {
  userType: UserType.PROFESSOR;
}

export interface Admin extends User {
  userType: UserType.ADMIN;
}

export interface Lecture {}

export interface AttendanceEntry {}

export interface Course {
  id: string;
  name: string;
  loggedInUserRole: string;
  lmsId: string;
}
