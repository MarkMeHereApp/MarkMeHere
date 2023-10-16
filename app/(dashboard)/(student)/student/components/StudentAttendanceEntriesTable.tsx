'use client';

import * as React from 'react';
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

interface StudentAttendanceEntriesTableProps {
    attendanceEntries: AttendanceEntry[];
}

const StudentAttendanceEntriesTable: React.FC<StudentAttendanceEntriesTableProps> = ({
    attendanceEntries
}) => {
  return (
        <Card className='h-full'>
            <CardContent className='p-4'> 
                <Table>
                    <TableHeader>
                        <TableRow className="flex justify-between">
                            <TableHead className='text-bold'>Date Marked</TableHead>
                            <TableHead className='text-bold'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceEntries.map((entry) => (
                        <TableRow className="flex justify-between text-right" key={entry.id}>
                            <TableCell>{format(entry.dateMarked, 'LLL dd, y')}</TableCell>
                            <TableCell>{entry.status}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
  );
};

export default StudentAttendanceEntriesTable;