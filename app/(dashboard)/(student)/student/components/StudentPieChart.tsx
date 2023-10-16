import * as React from 'react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentPieChartProps {
  pieChartData: any[];
}

interface PieChartData {
    id: string;
    label: string;
    value: number;
    fill: string;
}

const StudentPieChart: React.FC<StudentPieChartProps> = ({
  pieChartData
}) => {
  return (
    <Card>
      {pieChartData.length > 0 ? (
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        stroke="primary"
                    />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        payload={pieChartData.map((entry: PieChartData) => ({
                            id: entry.id,
                            type: 'circle',
                            value: entry.label,
                            color: entry.fill,
                        }))}
                    />
                    <Tooltip labelFormatter={(label) => label} />
                </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      ) : (
        <div className="pt-8 flex justify-center items-center">
            <Icons.logo
                className="wave primary-foreground"
                style={{ height: '100px', width: '100px' }}
            />
        </div>
      )}
    </Card>
  );
};

export default StudentPieChart;