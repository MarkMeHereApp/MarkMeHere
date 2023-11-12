'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import {
  zAttendanceStatus,
  ExtendedCourseMember,
  zAttendanceStatusIcons
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';
import { DataTableRowActions } from './data-table-row-actions';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useLecturesContext } from '../../../context-lecture';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import LocationAttendanceView from './data-table-location-component';
import StudentPageBoard from '../../../(student)/student/StudentPageBoard';

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
        return <div className="flex w-full">No Location</div>;
      }

      const distanceBetween2Points = (
        profLat: number,
        profLong: number,
        studLat: number,
        studLong: number
      ) => {
        if (profLat == studLat && profLong == studLong) {
          return 0;
        } else {
          const radlat1 = (Math.PI * profLat) / 180;
          const radlat2 = (Math.PI * studLat) / 180;
          const theta = profLong - studLong;
          const radtheta = (Math.PI * theta) / 180;
          let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = (dist * 180) / Math.PI;
          dist = dist * 60 * 6076.11549; //nothing: nautical miles,  miles: * 1.1515, km: * 1.852, meters: * 1852, feet: * 6,076.11549
          return dist;
        }
      };

      const calculateDistance = distanceBetween2Points(
        professorData.lectureLatitude,
        professorData.lectureLongitude,
        originalValue.AttendanceEntry?.studentLatitude,
        originalValue.AttendanceEntry?.studentLongtitude
      );

      const locationData = {
        professorLatitude: professorData.lectureLatitude,
        professorLongitude: professorData.lectureLongitude,
        studentLatitude: originalValue.AttendanceEntry?.studentLatitude,
        studentLongitude: originalValue.AttendanceEntry?.studentLongtitude,
      };
      

      //again, if you are readin this Jadyn, I am using the LocationAttendanceView from data-table-location-component, and I am trying to display.
      //you do the same thing in smembers columns line 93-104. Please help, I dont wanna hurt my laptop.
      if (calculateDistance) {
        if (calculateDistance > professorData.lectureRange) {
          return(
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs" className="pl-2 pr-2">
                  Out of Range
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[500px] h-[500px] ">
                <div className="grid gap-4 py-4">
                  <LocationAttendanceView postitonsData={locationData}></LocationAttendanceView>
                </div>
              </DialogContent>
          </Dialog>
          ) 
        } else if (calculateDistance <  professorData.lectureRange && calculateDistance > 0) {
          return <div className="flex w-full">In Range</div>;
        }
      }
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full">{row.getValue('email')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  }
];
