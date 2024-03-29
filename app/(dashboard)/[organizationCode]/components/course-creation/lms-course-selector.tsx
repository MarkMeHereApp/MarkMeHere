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
import { formatString, toastError } from '@/utils/globalFunctions';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOrganizationContext } from '../../context-organization';

export function LMSCourseSelector({
  selectedLMSCourse,
  setSelectedLMSCourse
}: {
  selectedLMSCourse: zLMSCourseSchemeType | null;
  setSelectedLMSCourse: React.Dispatch<
    React.SetStateAction<zLMSCourseSchemeType | null>
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const { organization } = useOrganizationContext();

  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery({
    organizationCode: organization.uniqueCode
  });

  if (getCanvasCoursesQuery.error) {
    toastError(getCanvasCoursesQuery.error.message);
    setSelectedLMSCourse(null);
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
      <div className="">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full"
          >
            {selectedLMSCourse
              ? getCanvasCoursesQuery?.data?.courseList.find(
                  (course) => course.lmsId === selectedLMSCourse.lmsId
                )?.name ||
                `ID: ${selectedLMSCourse.lmsId} - Course name not available`
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
                        <CommandItem
                          key={course.lmsId}
                          onSelect={() => {
                            setSelectedLMSCourse(
                              course.lmsId === selectedLMSCourse?.lmsId
                                ? null
                                : course
                            ); // Save the selected course
                            setOpen(false);
                          }}
                          disabled={!course.ableToCreateCourse}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedLMSCourse?.lmsId === course.lmsId
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />{' '}
                          <div className="flex justify-between">
                            <div
                              className={
                                course.ableToCreateCourse ? '' : 'opacity-50'
                              }
                            >
                              {course.name
                                ? course.name
                                : 'ID: ' +
                                  course.lmsId +
                                  ' - Course name unnavilable'}
                            </div>
                            <div>
                              <HoverCard>
                                <HoverCardTrigger>
                                  <InfoCircledIcon className=" h-4 w-4 shrink-0 ml-2" />
                                </HoverCardTrigger>
                                <CourseHoverCardContent course={course} />
                              </HoverCard>
                            </div>
                          </div>
                        </CommandItem>
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
