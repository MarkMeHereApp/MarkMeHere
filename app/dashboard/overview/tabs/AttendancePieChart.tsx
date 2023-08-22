'use client';

import { DonutChart, Legend } from '@tremor/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import sampleStudentData from '../../data/sample-student-data';

const AttendanceDonutChart = () => {
  const students = sampleStudentData; // Move this line inside the component
  const [selectedStudent, setSelectedStudent] = useState(students[0].name);

  const handleStudentChange = (studentName: string) => {
    setSelectedStudent(studentName);
  };

  const selectedStudentData = students.find(
    (student) => student.name === selectedStudent
  );

  const totalLectures = selectedStudentData?.totalLectures || 0;
  const lecturesAttended = selectedStudentData?.lecturesAttended || 0;

  const data = [
    {
      name: 'Attended',
      value: (lecturesAttended / totalLectures) * 100,
      fill: '#0088FE'
    },
    {
      name: 'Not Attended',
      value: 100 - (lecturesAttended / totalLectures) * 100,
      fill: '#FF8042'
    }
  ];

  return (
    <div className="flex gap-8">
      <div className="w-1/2">
        <label>Select a student: </label>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              {selectedStudent || 'Select a student'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            style={{ maxHeight: '215px', overflowY: 'auto' }}
          >
            {students.map((student) => (
              <DropdownMenuItem
                key={student.name}
                onClick={() => handleStudentChange(student.name)}
              >
                {student.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DonutChart
          variant="pie"
          data={data}
          animationDuration={450}
          colors={['emerald', 'red']}
          valueFormatter={(number: number) => {
            const roundedNumber = Number(number.toFixed(2));
            return `${roundedNumber}%`;
          }}
        />
        <Legend
          className="mt-3"
          categories={[data[0].name, data[1].name]}
          colors={['emerald', 'red']}
        />
      </div>
    </div>
  );
};

export default AttendanceDonutChart;
