'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import {
  zAttendanceStatus,
  ExtendedCourseMember,
  zAttendanceStatusIcons
} from '@/types/sharedZodTypes';
import { distanceBetween2Points, formatString } from '@/utils/globalFunctions';
import { DataTableRowActions } from './data-table-row-actions';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useLecturesContext } from '../../../context-lecture';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import GoogleMapsComponent from '../../../(student)/verification/components/googleMapsComponent';
import { useRef } from 'react';
import { getEmailText } from '@/server/utils/userHelpers';

enum Validity {
  inRange = 1,
  outRange = 0
}

export const columns: ColumnDef<ExtendedCourseMember>[] = [
  {
    id: 'id',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] sm:block hidden"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]  sm:block hidden"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const curName: string = row.getValue('name');
      const truncatedName = `${curName.substring(0, 15)}...`;

      return (
        <>
          <div className="flex w-[80px] overflow-hidden overflow-ellipsis sm:hidden">
            {curName}
          </div>
          {curName.length > 25 ? (
            <div className="flex w-full">{truncatedName}</div>
          ) : (
            <div className="flex w-full">{curName}</div>
          )}
        </>
      );
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'mark Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mark Status" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const originalValue = row.original as ExtendedCourseMember;
      const status = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.status
        : undefined;

      if (!status) {
        return (
          <div className="flex w-[100px] items-center">
            <QuestionMarkCircledIcon />
            <span className="ml-1">Unmarked</span>
          </div>
        );
      }

      try {
        const statusAsZod = zAttendanceStatus.parse(status);
        const IconComponent = zAttendanceStatusIcons[statusAsZod];

        return (
          <div className="flex w-[100px] items-center">
            <>
              <IconComponent />
              <span>{formatString(statusAsZod)}</span>
            </>
          </div>
        );
      } catch (e) {
        throw new Error(`Invalid attendance status: ${status}`);
      }
    },
    filterFn: (row, id, value) => {
      const originalValue = row.original as ExtendedCourseMember;
      const status = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.status
        : undefined;

      if (value.includes('unmarked')) {
        return status === undefined;
      }

      return value.includes(status);
    },
    enableSorting: false,
    enableHiding: true
  },
  {
    accessorKey: 'date marked',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Marked" />
    ),
    cell: ({ row }) => {
      const originalValue = row.original as ExtendedCourseMember;
      const dateMarked = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.dateMarked
        : undefined;

      if (!dateMarked) {
        return <div className="flex w-full">No Data</div>;
      }
      const formattedDate = dateMarked.toLocaleDateString();
      return <div className="flex w-full">{formattedDate}</div>;
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const originalValue = row.original as ExtendedCourseMember;
      const { lectures } = useLecturesContext();
      const validity = useRef<Validity | undefined>();
      const lecture = lectures?.find(
        (lecture) => lecture.id === originalValue.AttendanceEntry?.lectureId
      );

      if (!lecture) {
        return <></>;
      }

      const professorData = lecture.professorLectureGeolocation.find(
        (professor) =>
          professor.id ===
          originalValue.AttendanceEntry?.ProfessorLectureGeolocationId
      );

      if (!professorData) {
        return <></>;
      }

      if (
        !originalValue.AttendanceEntry?.studentLatitude ||
        !originalValue.AttendanceEntry?.studentLongtitude
      ) {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs" className="pl-2 pr-2">
                No Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[550px] h-[170px] ">
              <div className="grid gap-4 py-4 ">
                <DialogHeader className="flex justify-center items-center pb-[0px]">
                  <DialogTitle className="pb-[10px]">
                    The student did not share their location!
                  </DialogTitle>
                  <DialogDescription>
                    This most likely means the user didn't grant the browser
                    permission to share their location. Or there was an error.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </DialogContent>
          </Dialog>
        );
      }

      const calculateDistance = distanceBetween2Points(
        professorData.lectureLatitude,
        professorData.lectureLongitude,
        originalValue.AttendanceEntry?.studentLatitude,
        originalValue.AttendanceEntry?.studentLongtitude
      );

      const locationData = {
        professorLatitude: professorData.lectureLatitude,
        professorLongitude: professorData.lectureLongitude,
        professorRadius: professorData.lectureRange,
        studentLatitude: originalValue.AttendanceEntry?.studentLatitude,
        studentLongitude: originalValue.AttendanceEntry?.studentLongtitude
      };

      if (calculateDistance > professorData.lectureRange) {
        validity.current = Validity.outRange;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="xs" className="pl-2 pr-2">
                Out of Range
              </Button>
            </DialogTrigger>
            <DialogContent>
              <GoogleMapsComponent {...locationData} />
            </DialogContent>
          </Dialog>
        );
      } else {
        validity.current = Validity.inRange;
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="xs" className="pl-2 pr-2">
                In Range
              </Button>
            </DialogTrigger>
            <DialogContent>
              <GoogleMapsComponent {...locationData} />
            </DialogContent>
          </Dialog>
        );
      }
    },
    enableSorting: false,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full">{getEmailText(row.getValue('email'))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  }
];
