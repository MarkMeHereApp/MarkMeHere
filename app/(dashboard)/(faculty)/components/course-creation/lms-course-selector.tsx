import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/ui/icons';
import { trpc } from '@/app/_trpc/client';
import CourseHoverCardContent from './lms-hover-content';
import { zLMSCourseSchemeType } from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';

export function LMSCourseSelector({
  setSelectedLMSCourse
}: {
  setSelectedLMSCourse: React.Dispatch<
    React.SetStateAction<zLMSCourseSchemeType | null>
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery({});

  if (getCanvasCoursesQuery.error) {
    throw getCanvasCoursesQuery.error;
  }

  const uniqueErrorStatus = getCanvasCoursesQuery.data?.courseList
    ? [
        ...new Set(
          getCanvasCoursesQuery.data.courseList.map(
            (item) => item.createCourseErrorStatus
          )
        )
      ].sort()
    : [];

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
            <CommandList>
              <CommandInput placeholder="Search Courses..." />

              {getCanvasCoursesQuery.isLoading ? (
                <CommandGroup key={'Loading'}>
                  {[...Array(5)].map((_, index) => (
                    <CommandItem key={index}>
                      <Skeleton
                        className="h-7 mx-auto"
                        style={{ width: '80%' }}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : !getCanvasCoursesQuery.data ||
                getCanvasCoursesQuery.data.courseList.length === 0 ? (
                <CommandEmpty>No Courses found.</CommandEmpty>
              ) : (
                uniqueErrorStatus.map((status: string) => (
                  <CommandGroup key={status} heading={formatString(status)}>
                    {getCanvasCoursesQuery.data.courseList
                      .filter(
                        (course) => course.createCourseErrorStatus === status
                      )
                      .map((course) => (
                        <HoverCard>
                          <HoverCardTrigger>
                            <CommandItem
                              key={course.lmsId}
                              onSelect={() => {
                                setValue(
                                  course.lmsId === value ? '' : course.lmsId
                                );
                                setSelectedLMSCourse(
                                  course.lmsId === value ? null : course
                                ); // Save the selected course
                                setOpen(false);
                              }}
                              disabled={!course.ableToCreateCourse}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value === course.lmsId
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <span
                                className={
                                  course.ableToCreateCourse ? '' : 'opacity-50'
                                }
                              >
                                {course.name
                                  ? course.name
                                  : 'ID: ' +
                                    course.lmsId +
                                    ' - Course name unnavilable'}
                              </span>
                            </CommandItem>
                          </HoverCardTrigger>
                          <CourseHoverCardContent course={course} />
                        </HoverCard>
                      ))}
                  </CommandGroup>
                ))
              )}
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
