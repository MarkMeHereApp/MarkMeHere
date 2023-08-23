import { Button } from '@/components/ui/button';
import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { getFullName } from '@/utils/getFullName';

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
    <ScrollArea className="overflow-y-auto">
      <div className="space-y-1 max-h-96">
        {students.map((student) => (
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
  );
};

export default ScrollableAreaComponent;
