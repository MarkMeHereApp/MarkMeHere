import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useLecturesContext } from '../../../context-lecture';
import AttendanceOverTimeLineGraph from './AttendanceOverTimeLineGraph';
import OverviewBar from './OverviewBar';
import TopStudents from './TopStudents';

const OverviewAnalytics = () => {
  const { lectures } = useLecturesContext();
  // This gets the lectures from the current course already
  // lectures is an array of objects, where each object consists of a lecture and its attendance entries

  const { courseMembersOfSelectedCourse, selectedCourseEnrollment } =
    useCourseContext();
  const studentsOfSelectedCourse = courseMembersOfSelectedCourse?.filter(
    (member) => member.role === 'student'
  );
  // After getting the data, pass it to the AttendanceOverTimeLineGraph component and let it handle the rest
  // Do the same for the top students
  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full h-1/4">
        <OverviewBar
          selectedCourseName={selectedCourseEnrollment.course.name ?? ''}
          lectures={lectures}
          courseMembers={courseMembersOfSelectedCourse}
        />
      </div>
      <div className="grid grid-cols-3 h-3/4 pt-4 gap-8">
        <div className="col-span-2">
          <AttendanceOverTimeLineGraph
            lectures={lectures}
            numStudents={studentsOfSelectedCourse?.length ?? 0}
          />
        </div>
        <div className="col-span-1">
          <TopStudents />
        </div>
      </div>
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
