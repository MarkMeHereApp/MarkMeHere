'use client';

import React, { useState } from 'react';

import PieChartCardComponent from './PieChartCardComponent';
import ScrollableAreaComponent from './ScrollableAreaComponent';
import { getFullName } from '@/utils/getFullName';
import sampleStudentData from '@/app/dashboard/data/sample-student-data';

const students = sampleStudentData;

// Preprocess student data to include full names
const processedStudents = students.map((student) => ({
  ...student,
  fullName: getFullName(student)
}));

const AttendanceContainer: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState(
    processedStudents[0].fullName
  );

  const handleStudentChange = (studentName: string) => {
    setSelectedStudent(studentName);
  };

  const selectedStudentData = processedStudents.find(
    (student) => student.fullName === selectedStudent
  );

  const totalLectures = selectedStudentData?.totalLectures || 0;
  const lecturesAttended = selectedStudentData?.lecturesAttended || 0;

  const attendanceData = [
    {
      name: 'Attended',
      value: (lecturesAttended / totalLectures) * 100
    },
    {
      name: 'Not Attended',
      value: 100 - (lecturesAttended / totalLectures) * 100
    }
  ];

  const roundValueToTwoDecimalsPercent = (number: number) => {
    const roundedNumber = Number(number.toFixed(2));
    return `${roundedNumber}%`;
  };

  return (
    <div className="flex flex-row max-h-96 gap-x-8">
      <ScrollableAreaComponent
        students={processedStudents}
        selectedStudent={selectedStudent}
        handleStudentChange={handleStudentChange}
        className="basis-1/4 h-1/2"
      />
      <PieChartCardComponent
        selectedStudent={selectedStudent}
        attendanceData={attendanceData}
        roundValueToTwoDecimalsPercent={roundValueToTwoDecimalsPercent}
        className="basis-3/4 h-1/2"
      />
    </div>
  );
};

export default AttendanceContainer;
