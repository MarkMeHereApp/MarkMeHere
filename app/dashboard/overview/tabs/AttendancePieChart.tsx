import { Card, DonutChart, Legend, Title } from '@tremor/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { getFullName } from '@/utils/getFullName';
import sampleStudentData from '../../data/sample-student-data';

const students = sampleStudentData;

// Preprocess student data to include full names
const processedStudents = students.map((student) => ({
  ...student,
  fullName: getFullName(student)
}));

const AttendancePieChart = () => {
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
    <div className="flex gap-8">
      <div className="flex flex-col w-1/2">
        <ScrollArea className="overflow-y-auto">
          <div className="space-y-1 max-h-96">
            {processedStudents.map((student) => (
              <Button
                key={student.fullName}
                onClick={() => handleStudentChange(student.fullName)}
                className={`block w-full p-2 text-center cursor-pointer ${
                  selectedStudent === student.fullName
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white'
                }`}
              >
                {student.fullName}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Card className="p-8 flex flex-col items-center">
        <div className="mb-2">
          <Title>{selectedStudent || 'Select a student'}</Title>
        </div>
        <div className="flex-grow flex flex-col md:flex-row items-center">
          <div className="w-full md:w-3/5 text-center">
            <DonutChart
              variant="pie"
              data={attendanceData}
              animationDuration={450}
              colors={['emerald', 'red']}
              valueFormatter={roundValueToTwoDecimalsPercent}
            />
          </div>
          <div className="w-full md:w-2/5 mt-4 md:mt-0 md:ml-8">
            <Legend
              categories={attendanceData.map(
                (data) =>
                  `${data.name}: ${roundValueToTwoDecimalsPercent(data.value)}`
              )}
              colors={['emerald', 'red']}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendancePieChart;
