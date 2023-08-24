'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Student } from '@/utils/sharedTypes';

interface ScrollableAreaProps {
  students: Student[];
  selectedStudent: Student;
  className?: React.ComponentProps<'div'>['className'];
  handleStudentChange: (student: Student) => void;
}

const ScrollableAreaComponent: React.FC<ScrollableAreaProps> = ({
  students,
  selectedStudent,
  className,
  handleStudentChange
}) => {
  return (
    <div className={className}>
      <ScrollArea className="space-y-1 h-[17rem] overflow-y-auto border-1">
        {students.map((student) => (
          <Button
            variant={`${
              selectedStudent.id === student.id ? 'default' : 'ghost'
            }`}
            key={student.id}
            onClick={() => handleStudentChange(student)}
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
