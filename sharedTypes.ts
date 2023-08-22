export enum UserType {
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor'
}

export interface User {
  userID: string;
  userType: UserType;
  email: string;
  name: string;
  GPA: number;
  age: number;
  gender: string;
  lecturesAttended: number;
  totalLectures: number;
}

export interface Lecture {
  lectureID: string;
  attendance: User[];
  lectureStartDate: Date;
  lectureEndDate: Date;
}

export interface Course {
  courseID: string;
  admins: User[];
  professors: User[];
  students: User[];
  dateCreated: Date;
  courseStartDate: Date;
  courseEndDate?: Date;
  lectures: Lecture[];
}
