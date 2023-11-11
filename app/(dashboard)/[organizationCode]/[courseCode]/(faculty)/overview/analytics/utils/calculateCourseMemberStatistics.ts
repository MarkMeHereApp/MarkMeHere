import { CourseMember } from '@prisma/client';
import { lecturesType } from '../../../../context-lecture';
import { zAttendanceStatusType } from '@/types/sharedZodTypes';

interface CourseMemberStatistics {
  numPresent: number;
  numAbsent: number;
  numLate: number;
  numExcused: number;
  numTotal: number;
  attendanceGrade: number;
}

const countAttendanceStatus = (
  status: zAttendanceStatusType,
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
  if (!lectures || lectures?.length === 0) {
    return {
      numPresent: 0,
      numAbsent: 0,
      numLate: 0,
      numExcused: 0,
      numTotal: 0,
      attendanceGrade: 0
    };
  }

  const numPresent = countAttendanceStatus('here', member, lectures);
  const numAbsent = countAttendanceStatus('absent', member, lectures);
  const numLate = countAttendanceStatus('late', member, lectures);
  const numExcused = countAttendanceStatus('excused', member, lectures);
  const numTotal = lectures.length - numExcused;
  const attendanceGrade = numTotal > 0 ? numPresent / numTotal : 1;
  return {
    numPresent,
    numAbsent,
    numLate,
    numExcused,
    numTotal,
    attendanceGrade
  };
}
