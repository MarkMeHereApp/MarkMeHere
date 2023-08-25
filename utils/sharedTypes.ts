export enum UserType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR'
}

export interface User {
  id: string;
  userType?: UserType;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  password: string;
  dateCreated: Date;
  coursesAsStudent: Course[];
  coursesAsProfessor: Course[];
  coursesAsAdmin: Course[];
  lecturesAttendanceAsStudent: LectureAttendance[];
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

export interface Lecture {
  id: string;
  startDate: Date;
  endDate: Date;
  attendanceDate: Date;
  attendance: LectureAttendance[];
  courses: Course[];
}

export interface LectureAttendance {
  id: number;
  lecture: Lecture;
  lectureId: string;
  student: User;
  studentId: string;
  attendedAt: Date;
}

export interface Course {
  id: string;
  admins: Admin[];
  professors: Professor[];
  students: Student[];
  dateCreated: Date;
  startDate: Date;
  endDate?: Date;
  lectures: Lecture[];
}
