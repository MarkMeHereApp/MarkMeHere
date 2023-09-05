'use client';

import { useCourseContext } from '@/app/course-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ScrollArea } from '@/components/ui/scroll-area';

export function DataTableCSVPreview(props: { data: string[][] }) {
  let data = [];
  data = props.data;
  const courseID = useCourseContext().selectedCourseId;
  //   const role = useCourseContext().

  return (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">LMS ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((d) => (
            <TableRow key={d[0]}>
              <TableCell className="font-medium">{d[0]}</TableCell>
              <TableCell className="font-medium">{d[1]}</TableCell>
              <TableCell className="font-medium">{d[2]}</TableCell>
              <TableCell className="font-medium">{courseID}</TableCell>
              <TableCell className="font-medium">Student</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
