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
  );
};

export default PieChartCardComponent;
