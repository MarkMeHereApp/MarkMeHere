import { CourseMember } from '@prisma/client';
import { lecturesType } from '../../../../context-lecture';

interface CourseMemberStatistics {
  numPresent: number;
  numAbsent: number;
  numLate: number;
  numExcused: number;
  numTotal: number;
  attendanceGrade: number;
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

export default function calculateCourseMemberStatistics(
  member: CourseMember,
  lectures: lecturesType
): CourseMemberStatistics {
  const numPresent = countAttendanceStatus('here', member, lectures);
  const numAbsent = countAttendanceStatus('absent', member, lectures);
  const numLate = countAttendanceStatus('late', member, lectures);
  const numExcused = countAttendanceStatus('excused', member, lectures);
  const numTotal = numPresent + numAbsent + numLate - numExcused;
  const attendanceGrade = numPresent / numTotal;
  return {
    numPresent,
    numAbsent,
    numLate,
    numExcused,
    numTotal,
    attendanceGrade
  };
}
