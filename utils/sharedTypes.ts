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

export interface Course {
    id: string;
    students: User[];
    dateCreated: Date;
    startDate: Date;
    endDate?: Date;
    lectures: Lecture[];
}

export interface Lecture {
    id: string;     
    course: Course;
    courseId: string;
    startDate: Date;
    endDate?: Date;
    studentAttendance: User[]; 
    attendanceEntries: AttendanceEntry[];
}

export enum AttendanceStatus {
    PRESENT = 'PRESENT',
    LATE = 'LATE',
    EXCUSED = 'EXCUSED'
}
export interface AttendanceEntry {
    id: string; 
    lecture: Lecture;      
    lectureId: string;
    student: User;        
    studentId: String;
    checkInDate: Date; 
    status: AttendanceStatus;
}
