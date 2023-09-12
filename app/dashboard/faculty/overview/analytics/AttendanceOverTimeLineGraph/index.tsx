import { lecturesType } from '../../../lecture-context';
import AttendanceOverTimeLineGraphDisplay, { CoupledData } from './display';

// TODO: Implement AttendanceOverTimeLineGraphDisplay
// What should the data look like?
// I want the lectures sorted by date
// Attendance Rate is from 0% to 100%, based on the number of attendance entries and the number of students in the course
// Attendance Rate = (Number of Attendance Entries / Number of Students) * 100%
// The x-axis should be the date of the lecture
// The y-axis should be the attendance rate

export interface AttendanceOverTimeLineGraphProps {
  lectures: lecturesType;
  numStudents: number;
}

const AttendanceOverTimeLineGraph: React.FC<
  AttendanceOverTimeLineGraphProps
> = ({ lectures, numStudents }) => {
  if (!lectures || lectures?.length === 0) {
    return null;
  }
  const sortedLectures = lectures.sort((a, b) => {
    return a.lectureDate > b.lectureDate ? 1 : -1;
  });

  const graphData: CoupledData[] = sortedLectures.map((lecture) => {
    const numAttendanceEntries = lecture.attendanceEntries.length ?? 0;
    const attendanceRate =
      numAttendanceEntries > 0 ? (numAttendanceEntries / numStudents) * 100 : 0; // Calculate attendance rate or set to 0 if no attendance entries
    return {
      attendanceRate,
      currentLectureDate: lecture.lectureDate
    };
  });

  return <AttendanceOverTimeLineGraphDisplay data={graphData} />;
};

export default AttendanceOverTimeLineGraph;
