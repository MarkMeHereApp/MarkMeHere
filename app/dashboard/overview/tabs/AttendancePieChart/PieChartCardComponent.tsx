'use client';

import { Card, DonutChart, Legend, Title } from '@tremor/react';

import React from 'react';

interface PieChartCardProps {
  selectedStudent: string;
  attendanceData: AttendanceData[];
  roundValueToTwoDecimalsPercent: (number: number) => string;
}

interface AttendanceData {
  name: string;
  value: number;
}

const PieChartCardComponent: React.FC<PieChartCardProps> = ({
  selectedStudent,
  attendanceData,
  roundValueToTwoDecimalsPercent
}) => {
  return (
    <Card>
      <Title>{selectedStudent || 'Select a student'}</Title>
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
  );
};

export default PieChartCardComponent;
