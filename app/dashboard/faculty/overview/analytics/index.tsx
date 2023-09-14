import { useCourseContext } from '@/app/context-course';
import { useLecturesContext } from '../../../../context-lecture';
import AttendanceOverTimeLineGraph from './AttendanceOverTimeLineGraph';

const OverviewAnalytics = () => {
  const { lectures } = useLecturesContext();
  // This gets the lectures from the current course already
  // lectures is an array of objects, where each object consists of a lecture and its attendance entries

  const { courseMembersOfSelectedCourse } = useCourseContext();
  const studentsOfSelectedCourse = courseMembersOfSelectedCourse?.filter(
    (member) => member.role === 'student'
  );
  // After getting the data, pass it to the AttendanceOverTimeLineGraph component and let it handle the rest
  // Do the same for the top students
  return (
    <div className="flex h-full w-full">
      <div className="w-full h-full p-4">
        <AttendanceOverTimeLineGraph
          lectures={lectures}
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
