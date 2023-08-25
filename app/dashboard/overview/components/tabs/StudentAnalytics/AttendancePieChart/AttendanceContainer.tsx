'use client';

import React, { useState } from 'react';

import PieChartCardComponent from './PieChartCardComponent';
import ScrollableAreaComponent from './ScrollableAreaComponent';
import { Student } from '@/utils/sharedTypes';

interface AttendanceContainerProps {
  students: Student[];
}
const AttendanceContainer: React.FC<AttendanceContainerProps> = ({
  students
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const handleStudentChange = (student: Student) => {
    setSelectedStudent(student);
  };
  return (
    <div className="flex flex-row max-h-96 gap-x-8">
      {selectedStudent && (
        <>
          <ScrollableAreaComponent
            students={students}
            selectedStudent={selectedStudent}
            handleStudentChange={handleStudentChange}
            className="basis-1/3 h-auto"
          />
          <PieChartCardComponent
            selectedStudent={selectedStudent}
            className="basis-2/3 h-auto"
          />
        </>
      )}
    </div>
  );
};

export default AttendanceContainer;
