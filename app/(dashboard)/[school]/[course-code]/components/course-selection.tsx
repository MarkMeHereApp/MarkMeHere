'use client';
import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
import { CourseCreationSheet } from './course-creation-sheet';
import { useCourseContext } from '@/app/(dashboard)/[school]/[course-code]/context-course';
import { formatString } from '@/utils/globalFunctions';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CourseSelection() {
  const {
    selectedCourseId,
    courseMembersOfSelectedCourse,
    userCourses,
    userCourseMembers
  } = useCourseContext();

  const [open, setOpen] = React.useState(false);

  const params = useParams();
  const school = params['school'];

  const showCourses = () => {
    return (
      selectedCourseId &&
      userCourses &&
      userCourseMembers &&
      userCourses.length === 0
    );
  };

  const selectedCourse = userCourses?.find(
    (userCourse) => userCourse.id === selectedCourseId
  );

  const selectedCourseMembership = userCourseMembers?.find(
    (userCourseMember) => userCourseMember.courseId === selectedCourseId
  );

  const uniqueRoles = [...new Set(userCourseMembers?.map((item) => item.role))]
    .sort()
    .reverse();

  if (
    !selectedCourse ||
    !userCourses ||
    !userCourseMembers ||
    !selectedCourseMembership ||
    userCourses.length === 0
  ) {
    return (
      <Button variant="outline" className="max-w-2xl" disabled={true}>
        <Skeleton className="h-5 w-[250px] rounded-full" />
      </Button>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a Course"
              className="max-w-2xl"
            >
              <Avatar className="mr-2 h-5 w-5 ">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedCourse.courseCode}.png`}
                  alt={selectedCourse.courseCode}
                />
                <Skeleton className="h-5 w-5 rounded-full" />
              </Avatar>
              <span
                className={`pr-4 whitespace-nowrap overflow-hidden overflow-ellipsis ${
                  courseMembersOfSelectedCourse ? '' : 'opacity-50'
                }`}
              >
                {selectedCourse.name}
              </span>
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[320px] p-0 " align="start">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search Course..." />
                <CommandEmpty>No Course found.</CommandEmpty>
                {uniqueRoles.map((role) => (
                  <CommandGroup key={role} heading={formatString(role)}>
                    {userCourses?.map((course) => (
                      <Link href={`/${school}/${course.courseCode}`}>
                        <CommandItem
                          key={course.id}
                          onSelect={() => {
                            setOpen(false);
                          }}
                          className="text-sm"
                        >
                          <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${course.courseCode}.png`}
                              alt={course.courseCode}
                              className="grayscale"
                            />
                            <Skeleton className="h-5 w-5 rounded-full" />
                          </Avatar>
                          <span
                            className="overflow-ellipsis overflow-hidden max-w-85 whitespace-nowrap"
                            style={{ maxWidth: '85%' }}
                          >
                            {course.name}
                          </span>
                          <CheckIcon
                            className={cn(
                              'ml-auto h-4 w-4',
                              selectedCourseId === course.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
              <CommandSeparator />
            </Command>
            <CourseCreationSheet />
          </PopoverContent>
        </>
      </Popover>
    </>
  );
}
