import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { CourseMember } from '@prisma/client';
import { lecturesType } from '../../../../context-lecture';
import { useSelectedLectureContext } from '../../components/context-selected-lectures';
import { List } from '@radix-ui/react-tabs';

export interface TopStudentsProps {
  selectedCourseName: string;
  lectures: lecturesType;
  courseMembers: CourseMember[] | null;
}

const countAttendanceStatus = (
  status: string,
  member: CourseMember,
  givenLectures: lecturesType
) => {
  if (!givenLectures || givenLectures.length === 0) {
    return 0;
  }
  let count = 0;
  givenLectures.forEach((lecture) => {
    lecture.attendanceEntries.forEach((entry) => {
      if (entry.status === status && entry.courseMemberId === member.id) {
        count++;
      }
    });
  });
  return count;
};

const TopStudents: React.FC<TopStudentsProps> = ({
  lectures,
  courseMembers
}) => {
  if (!lectures || lectures?.length === 0) {
    return null;
  }
  const { selectedDateRange } = useSelectedLectureContext();

  // Assuming countAttendanceStatus and other variables are defined correctly

  // Initialize an empty map to hold student objects with member.id as keys
  const studentMap = new Map();

  courseMembers?.forEach((member) => {
    const numPresent = countAttendanceStatus('here', member, lectures);
    const numAbsent = countAttendanceStatus('absent', member, lectures);
    const numLate = countAttendanceStatus('late', member, lectures);
    const numExcused = countAttendanceStatus('excused', member, lectures);
    const numTotal = numPresent + numAbsent + numLate - numExcused;
    const attendanceGrade = Number.isNaN(numPresent / numTotal)
      ? 0
      : numPresent / numTotal;
    // Use member.id as key and store the rest of the information as an object
    studentMap.set(member.id, {
      name: member.name,
      email: member.email,
      lmsId: member.lmsId ?? '',
      optionalId: member.optionalId ?? '',
      dateEnrolled: member.dateEnrolled.toLocaleDateString(),
      role: member.role,
      numPresent: numPresent.toString(),
      numExcused: numExcused.toString(),
      numLate: numLate.toString(),
      numAbsent: numAbsent.toString(),
      numTotal: numTotal.toString(),
      attendanceGrade: attendanceGrade,
      totalLectures: lectures.length.toString()
    });
  });

  // Convert the map to an array of values and sort by the attendance ratio
  const sortedStudents = Array.from(studentMap.values()).sort(
    (a, b) => b.attendanceGrade - a.attendanceGrade
  );

  // Get the top 5 students, or fewer if there are not enough
  const topStudents = sortedStudents.slice(0, 5);

  // Dynamically create a div for each top student with TailwindCSS classes
  const studentCards = topStudents.map((student) => (
    <div
      key={student.memberId}
      className="bg-white shadow rounded-lg p-4 flex items-center justify-between"
    >
      <span className="font-semibold truncate">{student.name}</span>
      <span className="text-sm font-medium text-gray-500">
        {(100 * student.attendanceGrade).toFixed(2) + '%'}
      </span>
    </div>
  ));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top 5 Students</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-2 p-4">
        {studentCards}
      </CardContent>
    </Card>
  );
};

export default TopStudents;
