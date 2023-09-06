'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';

import { Icons } from '@/components/ui/icons';
import { trpc } from '@/app/_trpc/client';
import CourseHoverCardContent from './course-hover-content';

export function CanvasCourseSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery({});

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full"
          >
            {value && value !== ''
              ? getCanvasCoursesQuery?.data?.courseList.find(
                  (course) => course.lmsId === value
                )?.name || `ID: ${value} - Course name not available`
              : 'Import From Canvas (optional)'}
            <Icons.canvas className="text-xs text-destructive ml-auto" />

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search Courses..." />
            {!getCanvasCoursesQuery.data ||
            getCanvasCoursesQuery.data.courseList.length === 0 ? (
              <CommandEmpty>No Courses found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {getCanvasCoursesQuery.data.courseList.map((course) => (
                  <HoverCard>
                    <HoverCardTrigger>
                      <CommandItem
                        key={course.lmsId}
                        onSelect={() => {
                          setValue(course.lmsId === value ? '' : course.lmsId);
                          setOpen(false);
                        }}
                        disabled={false}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === course.lmsId ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {course.name ? (
                          course.name
                        ) : (
                          <span>
                            ID: {course.lmsId} - <i>Course name unnavilable</i>
                          </span>
                        )}
                      </CommandItem>
                    </HoverCardTrigger>
                    <CourseHoverCardContent course={course} />
                  </HoverCard>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
