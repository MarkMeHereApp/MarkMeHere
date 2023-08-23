'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface ScrollableAreaProps {
  students: Student[];
  selectedStudent: string;
  handleStudentChange: (studentName: string) => void;
}

interface Student {
  fullName: string;
}

const ScrollableAreaComponent: React.FC<ScrollableAreaProps> = ({
  students,
  selectedStudent,
  handleStudentChange
}) => {
  return (
    <ScrollArea className="space-y-1">
      {students.map((student) => (
        <Button
          key={student.fullName}
          onClick={() => handleStudentChange(student.fullName)}
          className={`w-full p-2 text-center cursor-pointer border-2 border-slate-300 ${
            selectedStudent === student.fullName
              ? 'bg-yellow-500 text-white'
              : 'bg-white'
          }`}
        >
          {student.fullName}
        </Button>
      ))}
    </ScrollArea>
  );
};

export default ScrollableAreaComponent;
