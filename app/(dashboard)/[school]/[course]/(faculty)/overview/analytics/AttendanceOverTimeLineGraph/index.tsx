import { lecturesType } from '../../../../../context-lecture';
import AttendanceOverTimeLineGraphDisplay, { CoupledData } from './display';
import { Lecture, AttendanceEntry } from '@prisma/client';

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

  const calculateAttendanceRate = (
    lecture: { attendanceEntries: AttendanceEntry[] } & Lecture,
    numStudents: number
  ) => {
    return (lecture.attendanceEntries.length / numStudents) * 100 ?? 0;
  };

  const graphData: CoupledData[] = sortedLectures.map((lecture, index) => {
    const attendanceRate = calculateAttendanceRate(lecture, numStudents);

    // Calculate the moving average at the current date
    const numLecturesConsidered = index + 1; // Include all lectures up to the current one
    const previousLectures = sortedLectures.slice(0, numLecturesConsidered);
    const totalAttendanceRateSum = previousLectures.reduce(
      (sum, prevLecture) =>
        sum + calculateAttendanceRate(prevLecture, numStudents), // Use 0 if attendanceRate is undefined
      0
    );
    const movingAverage =
      numLecturesConsidered > 0
        ? totalAttendanceRateSum / numLecturesConsidered
        : 0;

    return {
      attendanceRate,
      currentLectureDate: lecture.lectureDate,
      movingAverage
    };
  });

  return <AttendanceOverTimeLineGraphDisplay data={graphData} />;
};

export default AttendanceOverTimeLineGraph;
