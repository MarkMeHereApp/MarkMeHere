import * as React from 'react';
import { useEffect, useState } from 'react';
import { AttendanceEntry } from '@prisma/client';
import StudentPie from './StudentPie';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface PieChartCardProps {
  attendanceEntries: AttendanceEntry[];
}

const PieChartCardComponent: React.FC<PieChartCardProps> = ({
  attendanceEntries
}) => {
  const [attendanceDataPie, setAttendanceDataPie] = useState<any[]>([]);

  useEffect(() => {
    const calculateAttendanceEntryData = () => {
      const totalAttendanceEntries = attendanceEntries.length;

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
          id: 'Attended',
          label: 'Attended',
          value:
            ((hereEntries.length + excusedEntries.length + lateEntries.length) / totalAttendanceEntries) * 100,
        },
        {
          id: 'Not Attended',
          label: 'Not Attended',
          value: (absentEntries.length / totalAttendanceEntries) * 100,
        },
      ];

      const pieData2 = [
        {
          id: 'Here',
          label: 'Here',
          value: (hereEntries.length / totalAttendanceEntries) * 100,
        },
        {
          id: 'Excused',
          label: 'Excused',
          value: (excusedEntries.length / totalAttendanceEntries) * 100,
        },
        {
          id: 'Late',
          label: 'Late',
          value: (lateEntries.length / totalAttendanceEntries) * 100,
        },
        {
          id: 'Absent',
          label: 'Absent',
          value: (absentEntries.length / totalAttendanceEntries) * 100,
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
              <StudentPie key={index} data={data} />
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

export default PieChartCardComponent;
