import { useCourseContext } from '@/app/context-course';
import AttendanceOverTimeLineGraph from './AttendanceOverTimeLineGraph';
import OverviewBar from './OverviewBar';
import { useState } from 'react';
import { useSelectedLectureContext } from '../components/context-selected-lectures';
import { useLecturesContext } from '@/app/context-lecture';
const OverviewAnalytics = () => {
  const { selectedLectures } = useSelectedLectureContext();
  console.log(selectedLectures);
  const { courseMembersOfSelectedCourse, userCourses, selectedCourseId } =
    useCourseContext();
  const studentsOfSelectedCourse = courseMembersOfSelectedCourse?.filter(
    (member) => member.role === 'student'
  );
  const selectedCourseName = userCourses?.find((courses) => {
    return courses.id === selectedCourseId;
  })?.name;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full h-1/4 p-4">
        <OverviewBar
          selectedCourseName={selectedCourseName ?? ''}
          lectures={selectedLectures}
          courseMembers={courseMembersOfSelectedCourse}
        />
      </div>
      <div className="w-full h-3/4 p-4">
        <AttendanceOverTimeLineGraph
          lectures={selectedLectures}
          numStudents={studentsOfSelectedCourse?.length ?? 0}
        />
      </div>
      {/* <div className="w-1/3 h-full bg-green-500">
        Insert top students
        <TopStudents />
      </div> */}
    </div>
  );
};

export default OverviewAnalytics;

//                   Rough Diagram
//           | - - - - - - - - - - - - - - |
//           |            Hello            |
//           | - - - - - - - - - - - - - - |
//           |                     |       |<--- Start of OverviewAnalytics Box
//           |        Attendance   | TopS. |
//           |                     |       |
//           |                     |       |
//           | - - - - - - - - - - - - - - |
//
//
// Idea: Add line graph to show average check in time
