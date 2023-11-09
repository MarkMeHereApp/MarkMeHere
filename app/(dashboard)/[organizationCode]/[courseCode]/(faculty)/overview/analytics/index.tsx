import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import AttendanceOverTimeLineGraph from './AttendanceOverTimeLineGraph';
import OverviewBar from './OverviewBar';
import SupportList from './SupportList';
import { useSelectedLectureContext } from '../components/context-selected-lectures';

const OverviewAnalytics = () => {
  const { selectedLectures } = useSelectedLectureContext();
  // This gets the lectures from the current course already
  // lectures is an array of objects, where each object consists of a lecture and its attendance entries

  const { courseMembersOfSelectedCourse, selectedCourse } = useCourseContext();
  const studentsOfSelectedCourse = courseMembersOfSelectedCourse?.filter(
    (member) => member.role === 'student'
  );
  // After getting the data, pass it to the AttendanceOverTimeLineGraph component and let it handle the rest
  // Do the same for the top students
  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full h-1/4">
        <OverviewBar
          selectedCourseName={selectedCourse.name ?? ''}
          lectures={selectedLectures}
          courseMembers={courseMembersOfSelectedCourse}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 h-3/4 pt-4 gap-8">
        <div className="md:col-span-2">
          <AttendanceOverTimeLineGraph
            lectures={selectedLectures}
            numStudents={studentsOfSelectedCourse?.length ?? 0}
          />
        </div>
        <div className="md:col-span-1">
          <SupportList
            selectedCourseName={selectedCourse.name ?? ''}
            lectures={selectedLectures}
            courseMembers={courseMembersOfSelectedCourse}
          />
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
