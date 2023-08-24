'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface ScrollableAreaProps {
  students: Student[];
  selectedStudent: string;
  handleStudentChange: (studentName: string) => void;
  className?: React.ComponentProps<'div'>['className'];
}

interface Student {
  fullName: string;
}

const ScrollableAreaComponent: React.FC<ScrollableAreaProps> = ({
  students,
  selectedStudent,
  handleStudentChange,
  className
}) => {
  return (
    <div className={className}>
      <ScrollArea className="space-y-1 h-full overflow-y-auto">
        {students.map((student) => (
          <Button
            variant={`${
              selectedStudent === student.fullName ? 'default' : 'ghost'
            }`}
            key={student.fullName}
            onClick={() => handleStudentChange(student.fullName)}
            className={`w-full h-fit p-2 text-center cursor-pointer border-2 border-border`}
          >
            {student.fullName}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default ScrollableAreaComponent;
