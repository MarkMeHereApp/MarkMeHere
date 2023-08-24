import { Student, User, UserType } from '@/utils/sharedTypes';

import StudentsView from './StudentsView';
import { getFullName } from '@/utils/getFullName';

interface StudentStatisticsProps {
  users: User[];
}

const StudentStatistics: React.FC<StudentStatisticsProps> = ({ users }) => {
  const students = users?.filter((element) => {
    return element.userType === UserType.Student;
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
        <StudentsView students={processedStudents} />
      )}
    </>
  );
};

export default StudentStatistics;
