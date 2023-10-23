'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { AttendanceEntry } from '@prisma/client';
import { useLecturesContext } from '@/app/context-lecture';
import { ExtendedAttendanceEntry } from '@/types/sharedZodTypes';

interface StudentAttendanceEntriesTableProps {
    attendanceEntries: AttendanceEntry[];
}

const StudentAttendanceEntriesTable: React.FC<StudentAttendanceEntriesTableProps> = ({
    attendanceEntries
}) => {
  const [extendedEntries, setExtendedEntries] = React.useState<ExtendedAttendanceEntry[]>([]);
  const { lectures } = useLecturesContext();  

  const getLectureDate = (lectureId: string) => {
    const curLecture = lectures?.find((lecture) => lecture.id === lectureId);
    return curLecture?.lectureDate;
  };

  useEffect(() => {
    const sortedEntries = attendanceEntries.sort((a, b) => {
        const aLectureDate = getLectureDate(a.lectureId);
        const bLectureDate = getLectureDate(b.lectureId);
        if (aLectureDate && bLectureDate) {
          return Number(bLectureDate) - Number(aLectureDate);
        }
        return 0;
      });
    const newEntries: ExtendedAttendanceEntry[] = sortedEntries.map((entry) => {
        return {
            ...entry, 
            LectureDate: getLectureDate(entry.lectureId), 
        };
    });
    setExtendedEntries(newEntries);
  }, [attendanceEntries]);

  return (
        <Card className='h-full'>
            <CardContent className='p-4'> 
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[120px] font-semibold'>Date</TableHead>
                            <TableHead className='font-semibold'>Date Marked</TableHead>
                            <TableHead className='text-right font-semibold'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {extendedEntries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell className='font-normal'>
                                {entry.LectureDate && format(new Date(entry.LectureDate), 'LLL dd, y')}
                            </TableCell>
                            <TableCell className='font-normal'>{format(entry.dateMarked, 'LLL dd, y')}</TableCell>
                            <TableCell className='text-right font-normal'>{entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
  );
};

export default StudentAttendanceEntriesTable;