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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';
import { zCreateCourseErrorDescriptions } from '@/types/sharedZodTypes';
import { Icons } from '@/components/ui/icons';
import { trpc } from '@/app/_trpc/client';

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
                            ID: {course.lmsId} - Course name unnavilable
                          </span>
                        )}
                      </CommandItem>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="right">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            {course.name || 'No Course Name'}
                          </h4>
                          <p className="text-xs">
                            <i>
                              {course.course_code ? (
                                <>
                                  <b>Course Code:</b> {course.course_code}
                                </>
                              ) : (
                                'No Course Code'
                              )}
                            </i>
                          </p>
                          <p className="text-xs">
                            <i>
                              <b>Course ID: </b>
                              {course.lmsId}
                            </i>
                          </p>
                          <p className="text-xs">
                            <i>
                              <b>
                                {course.enrollments.length > 1
                                  ? 'Course Roles: '
                                  : 'Course Role: '}
                              </b>
                              {course.enrollments.map(
                                (enrollment, index, array) => (
                                  <span key={index}>
                                    {enrollment.role
                                      .split(/(?=[A-Z])/)
                                      .join(' ')}
                                    {index < array.length - 1 ? ', ' : ''}
                                  </span>
                                )
                              )}
                            </i>
                          </p>
                          <p className="text-sm">
                            {course.ableToCreateCourse ? (
                              <span className="flex items-start flex-wrap">
                                <CheckCircledIcon className="mr-2 mt-1 text-primary" />
                                {' This course is available to import.'}
                              </span>
                            ) : (
                              <span className="flex items-start flex-wrap">
                                <CrossCircledIcon className="mr-2 mt-1 text-destructive" />
                                <span style={{ maxWidth: '90%' }}>
                                  {course.createCourseError
                                    ? zCreateCourseErrorDescriptions[
                                        course.createCourseError
                                      ]
                                    : 'Unexpected Erorr'}
                                </span>
                              </span>
                            )}
                          </p>

                          <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                            <span className="text-xs text-muted-foreground">
                              {course.start_at && course.end_at
                                ? `${new Date(
                                    course.start_at
                                  ).toLocaleDateString()} - ${new Date(
                                    course.end_at
                                  ).toLocaleDateString()}`
                                : course.start_at
                                ? `Starts at ${new Date(
                                    course.start_at
                                  ).toLocaleDateString()}`
                                : course.end_at
                                ? `Ends at ${new Date(
                                    course.end_at
                                  ).toLocaleDateString()}`
                                : 'Course dates not available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
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
