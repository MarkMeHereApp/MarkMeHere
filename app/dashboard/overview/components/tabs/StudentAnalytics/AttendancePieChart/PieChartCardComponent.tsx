'use client';

import { Card } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/tremorcharts/';
import { Legend } from '@/components/tremorcharts/common/legend';
import React from 'react';
import { Student } from '@/utils/sharedTypes';

interface PieChartCardProps {
  selectedStudent: Student;
  className?: React.ComponentProps<'div'>['className'];
}

const roundValueToTwoDecimalsPercent = (number: number) => {
  const roundedNumber = Number(number.toFixed(2));
  return `${roundedNumber}%`;
};

const PieChartCardComponent: React.FC<PieChartCardProps> = ({
  selectedStudent,
  className
}) => {
  const totalLectures = selectedStudent?.totalLectures || 0;
  const lecturesAttended = selectedStudent?.lecturesAttended || 0;

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

  return (
    <div className={className}>
      <Card className="flex flex-col items-center justify-center p-2 space-y-2">
        <CardTitle className={'text-foreground'}>
          {`${selectedStudent.firstName} ${selectedStudent.lastName}` ||
            'Select a student'}
        </CardTitle>
        <DonutChart
          variant="pie"
          data={attendanceData}
          animationDuration={450}
          colors={['emerald', 'red']}
          valueFormatter={roundValueToTwoDecimalsPercent}
        />
        <Legend
          categories={attendanceData.map(
            (data) =>
              `${data.name}: ${roundValueToTwoDecimalsPercent(data.value)}`
          )}
          colors={['emerald', 'red']}
        />
      </Card>
    </div>
  );
};

export default PieChartCardComponent;
