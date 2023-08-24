'use client';

import { Card } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/tremorcharts/';
import { Legend } from '@/components/tremorcharts/common/legend';
import React from 'react';

interface PieChartCardProps {
  selectedStudent: string;
  attendanceData: AttendanceData[];
  className?: React.ComponentProps<'div'>['className'];
}

interface AttendanceData {
  name: string;
  value: number;
}

const roundValueToTwoDecimalsPercent = (number: number) => {
  const roundedNumber = Number(number.toFixed(2));
  return `${roundedNumber}%`;
};

const PieChartCardComponent: React.FC<PieChartCardProps> = ({
  selectedStudent,
  attendanceData,
  className
}) => {
  return (
    <div className={className}>
      <Card className="flex flex-col items-center justify-center p-2 space-y-2">
        <CardTitle className={'text-foreground'}>
          {selectedStudent || 'Select a student'}
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
