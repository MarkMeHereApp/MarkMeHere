'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { zAttendanceStatusIconsNotFun } from '@/types/sharedZodTypes';
import { zAttendanceStatus } from '@/types/sharedZodTypes';
interface AttendanceStatusesProps {
  attendanceData: any[];
}

const AttendanceStatuses: React.FC<AttendanceStatusesProps> = ({
  attendanceData
}) => {
  return (
    <Card>
      <CardContent className="p-2 flex flex-row items-center justify-center w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-14 sm:gap-y-0">
          {zAttendanceStatus.options.map((value, index) => {
            const Icon = zAttendanceStatusIconsNotFun[value];
            return (
              <div
                key={value}
                className="p-2 flex flex-col text-center font-semibold"
              >
                <div className="flex flex-row items-center">
                  {Icon && (
                    <Icon className="mr-2 h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16" />
                  )}
                  <div className="flex flex-col text-start">
                    <span className="text-xl sm:text-4xl">
                      {String(attendanceData[index]?.value) + '%'}{' '}
                    </span>
                    <span className="text-xl sm:text-2xl font-semibold">
                      {attendanceData[index]?.name.toUpperCase() || ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceStatuses;
