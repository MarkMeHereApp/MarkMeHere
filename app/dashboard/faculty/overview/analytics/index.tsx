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

const OverviewAnalytics = () => {
  return (
    <div className="flex h-full w-full">
      <div className="w-2/3 h-full bg-blue-500">
        Insert line graph
        {/* <AttendanceOverTimeLineGraph /> */}
      </div>
      <div className="w-1/3 h-full bg-green-500">
        Insert top students
        {/* <TopStudents /> */}
      </div>
    </div>
  );
};

export default OverviewAnalytics;
