import * as React from 'react';
import { useEffect, useState } from 'react';
import { AttendanceEntry } from '@prisma/client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentPieChartProps {
  attendanceEntries: AttendanceEntry[];
}

interface PieChartData {
    id: string;
    label: string;
    value: number;
    fill: string;
}

const StudentPieChart: React.FC<StudentPieChartProps> = ({
  attendanceEntries
}) => {
  const [attendanceDataPie, setAttendanceDataPie] = useState<any[]>([]);

  useEffect(() => {
    const calculateAttendanceEntryData = () => {
      const totalAttendanceEntries = attendanceEntries.length;
      // here (green), absent (red), excused (yellow), late (orange)
      const colors = ['#7bc043', '#ee4035', '#ffc425', '#f37736'];

      const hereEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
        return entry.status === 'here';
      });
      const excusedEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
        return entry.status === 'excused';
      });
      const lateEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
        return entry.status === 'late';
      });
      const absentEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
        return entry.status === 'absent';
      });

      const pieData1 = [
        {
          label: 'Attended',
          name: 'Attended',
          value:
            ((hereEntries.length + excusedEntries.length + lateEntries.length) / totalAttendanceEntries) * 100,
          fill: colors[0]
        },
        {
          label: 'Not Attended',
          name: 'Not Attended',
          value: (absentEntries.length / totalAttendanceEntries) * 100,
          fill: colors[1]
        },
      ];

      const pieData2 = [
        {
          label: 'Here',
          name: 'Here',
          value: (hereEntries.length / totalAttendanceEntries) * 100,
          fill: colors[0]
        },
        {
          label: 'Excused',
          name: 'Excused',
          value: (excusedEntries.length / totalAttendanceEntries) * 100,
          fill: colors[2]
        },
        {
          label: 'Late',
          name: 'Late',
          value: (lateEntries.length / totalAttendanceEntries) * 100,
          fill: colors[3]
        },
        {
          label: 'Absent',
          name: 'Absent',
          value: (absentEntries.length / totalAttendanceEntries) * 100,
          fill: colors[1]
        },
      ];

      setAttendanceDataPie([pieData1, pieData2]);
    };
    calculateAttendanceEntryData();
  }, [attendanceEntries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Statistics</CardTitle>
        <CardDescription>Your overall attendance records.</CardDescription>
      </CardHeader>
      {attendanceDataPie.length > 0 ? (
        <CardContent>
          <div className="h-96 flex flex-row">
            {attendanceDataPie.map((data, index) => (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label
                    />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        payload={data.map((entry: PieChartData) => ({
                            id: entry.id,
                            type: 'circle',
                            value: entry.label,
                            color: entry.fill,
                        }))}
                    />
                    <Tooltip labelFormatter={(label) => label} />
                </PieChart>
            </ResponsiveContainer>
            ))}
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