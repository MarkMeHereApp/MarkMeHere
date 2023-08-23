export enum UserType {
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor'
}

export interface User {
  id: string;
  userType: UserType;
  email: string;
  firstName: string;
  lastName: string;
  GPA: number;
  age: number;
  gender: string;
  lecturesAttended: number;
  totalLectures: number;
  password: string;
}

export interface Lecture {
  id: string;
  attendance: User[];
  StartDate: Date;
  EndDate: Date;
}

export interface Course {
  id: string;
  admins: User[];
  professors: User[];
  students: User[];
  dateCreated: Date;
  StartDate: Date;
  EndDate?: Date;
  lectures: Lecture[];
}
