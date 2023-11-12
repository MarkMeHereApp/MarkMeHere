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
import { DateRange } from 'react-day-picker';
import { useSelectedLectureContext } from '../../components/context-selected-lectures';

export function CalendarDateRangePicker({
  className
}: React.HTMLAttributes<HTMLDivElement>) {
  const { selectedDateRange, setSelectedDateRange } =
    useSelectedLectureContext();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    selectedDateRange
  );

  const handleDateClick = (dateRange: DateRange | undefined) => {
    setDateRange(dateRange);
    if (dateRange) {
      setSelectedDateRange(dateRange);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateClick}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
