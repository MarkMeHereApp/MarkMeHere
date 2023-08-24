export enum UserType {
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor'
}

export interface User {
  id: string;
  userType: UserType;
  dateCreated: Date;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
}

export interface Student extends User {
  GPA?: number;
  age?: number;
  gender?: string;
  lecturesAttended?: number;
  totalLectures?: number;
}

export interface Admin extends User {
  courses: Course[];
}

export interface Professor extends User {
  courses: Course[];
}

export interface Lecture {
  id: string;
  attendance: User[];
  StartDate: Date;
  EndDate: Date;
}

export interface Course {
  id: string;
  admins: Admin[];
  professors: Professor[];
  students: Student[];
  dateCreated: Date;
  StartDate: Date;
  EndDate?: Date;
  lectures: Lecture[];
}
