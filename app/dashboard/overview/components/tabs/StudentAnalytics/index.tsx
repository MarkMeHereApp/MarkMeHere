import { Student, User, UserType } from '@/utils/sharedTypes';

import AttendanceView from './AttendanceView';
import { getFullName } from '@/utils/getFullName';

interface StudentStatisticsProps {
  users: User[];
}

const StudentAnalytics: React.FC<StudentStatisticsProps> = ({ users }) => {
  const students = users?.filter((element) => {
    return element.userType === UserType.STUDENT;
  });

  const processedStudents = students?.map(
    (student) =>
      ({
        ...student,
        fullName: getFullName(student)
      } as Student)
  );

  return (
    <>
      {processedStudents?.length > 0 && (
        <AttendanceView students={processedStudents} />
      )}
    </>
  );
};

export default StudentAnalytics;
