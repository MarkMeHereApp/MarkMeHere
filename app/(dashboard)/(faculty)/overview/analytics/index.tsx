import { useCourseContext } from '@/app/context-course';
import { useLecturesContext } from '../../../../context-lecture';
import AttendanceOverTimeLineGraph from './AttendanceOverTimeLineGraph';
import OverviewBar from './OverviewBar';

const OverviewAnalytics = () => {
  const { lectures } = useLecturesContext();
  // This gets the lectures from the current course already
  // lectures is an array of objects, where each object consists of a lecture and its attendance entries

  const { courseMembersOfSelectedCourse, userCourses, selectedCourseId } =
    useCourseContext();
  const studentsOfSelectedCourse = courseMembersOfSelectedCourse?.filter(
    (member) => member.role === 'student'
  );
  const selectedCourseName = userCourses?.find((courses) => {
    return courses.id === selectedCourseId;
  })?.name;

  // After getting the data, pass it to the AttendanceOverTimeLineGraph component and let it handle the rest
  // Do the same for the top students
  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full h-1/4 p-4">
        <OverviewBar
          selectedCourseName={selectedCourseName ?? ''}
          lectures={lectures}
          courseMembers={courseMembersOfSelectedCourse}
        />
      </div>
      <div className="w-full h-3/4 p-4">
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
