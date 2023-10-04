'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ScrollArea } from '@/components/ui/scroll-area';
import { CourseMember } from '@prisma/client';

export function CSV_Preview(props: {
  data: CourseMember[];
  existingMembers: CourseMember[];
}) {
  const { data, existingMembers } = props;

  return (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>LMS ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((d) => {
            const isExistingMember =
              existingMembers &&
              existingMembers.length > 0 &&
              existingMembers.some(
                (existingMember) => existingMember.lmsId === d.lmsId
              );

            const textColor = isExistingMember ? 'IndianRed' : 'black';

            return (
              <TableRow key={d.id}>
                <TableCell className="font-medium" style={{ color: textColor }}>
                  {d.name}
                </TableCell>
                <TableCell className="font-medium" style={{ color: textColor }}>
                  {d.lmsId}
                </TableCell>
                <TableCell className="font-medium" style={{ color: textColor }}>
                  {d.email}
                </TableCell>
                <TableCell className="font-medium" style={{ color: textColor }}>
                  {' '}
                  {d.courseId}
                </TableCell>
                <TableCell className="font-medium" style={{ color: textColor }}>
                  {d.role}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
