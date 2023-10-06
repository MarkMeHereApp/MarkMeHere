'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useCourseContext } from '@/app/context-course';

export function CalendarDateRangePicker({
  className
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selectedAttendanceDate, setSelectedAttendanceDate } =
    useCourseContext();
  const [date, setDate] = React.useState<Date | undefined>(
    selectedAttendanceDate || new Date()
  );

  const handleDateClick = (day: Date) => {
    setDate(day);
    setSelectedAttendanceDate(day);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[252px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'LLL dd, y') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={(date) => {
              if (date) {
                handleDateClick(date);
              }
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// 'use client';

// import * as React from 'react';
// import { CalendarIcon } from '@radix-ui/react-icons';
// import { addDays, format } from 'date-fns';
// import { DateRange } from 'react-day-picker';

// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from '@/components/ui/popover';
// import { useCourseContext } from '@/app/course-context';

// export function CalendarDateRangePicker({
//   className
// }: React.HTMLAttributes<HTMLDivElement>) {
//     const { selectedAttendanceDate, setSelectedAttendanceDate } = useCourseContext();
//     const [date, setDate] = React.useState<DateRange | undefined>({from: undefined, to: undefined});

//   const handleDateClick = (day: DateRange) => {
//     console.log(day.from );
//     setDate({ from: day.from, to: day.to });

//     setSelectedAttendanceDate(day.from ?? null);
//   };

//   React.useEffect(() => {
//     if (selectedAttendanceDate) {
//         setDate({ from: selectedAttendanceDate, to: selectedAttendanceDate});
//     }
//     else {
//         setDate({ from: new Date(), to: new Date()});
//     }
//   }, []);

//   return (
//     <div className={cn('grid gap-2', className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={'outline'}
//             className={cn(
//               'w-[260px] justify-start text-left font-normal',
//               !date && 'text-muted-foreground'
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//                 format(date.from, 'LLL dd, y')
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="end">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={(date) => {
//                 if (date) {
//                   handleDateClick(date);
//                 }
//               }}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
