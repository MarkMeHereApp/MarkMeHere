import { Student, User, UserType } from '@/utils/sharedTypes';

import AttendanceView from './AttendanceView';

interface StudentStatisticsProps {
  users: User[];
}

const StudentAnalytics: React.FC<StudentStatisticsProps> = ({ users }) => {
  const students = users?.filter((element) => {
    return element.userType === UserType.STUDENT;
  }) as Student[];

  return <>{students?.length > 0 && <AttendanceView students={students} />}</>;
};

export default StudentAnalytics;
