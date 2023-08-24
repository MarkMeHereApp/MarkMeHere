'use client';

// PieChartCardComponent.styles.ts
import '../../../../../styles/globals.css'; // Import the globals.css file

import { DonutChart, Legend } from '@tremor/react';

import { Card } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import React from 'react';

interface PieChartCardProps {
  selectedStudent: string;
  attendanceData: AttendanceData[];
  roundValueToTwoDecimalsPercent: (number: number) => string;
  className?: React.ComponentProps<'div'>['className'];
}

interface AttendanceData {
  name: string;
  value: number;
}

const PieChartCardComponent: React.FC<PieChartCardProps> = ({
  selectedStudent,
  attendanceData,
  roundValueToTwoDecimalsPercent,
  className
}) => {
  return (
    <div className={className}>
      <Card>
        <CardTitle>{selectedStudent || 'Select a student'}</CardTitle>
        <>
          <>
            <DonutChart
              variant="pie"
              data={attendanceData}
              animationDuration={450}
              colors={['emerald', 'red']}
              valueFormatter={roundValueToTwoDecimalsPercent}
            />
          </>
          <>
            <Legend
              categories={attendanceData.map(
                (data) =>
                  `${data.name}: ${roundValueToTwoDecimalsPercent(data.value)}`
              )}
              colors={['emerald', 'red']}
            />
          </>
        </>
      </Card>
    </div>
  );
};

export default PieChartCardComponent;
