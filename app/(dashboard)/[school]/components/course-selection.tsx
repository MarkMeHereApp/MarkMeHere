'use client';
import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon
} from '@radix-ui/react-icons';
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
import { useCourseContext } from '@/app/context-course';
import { formatString } from '@/utils/globalFunctions';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/general/loading';

export default function CourseSelection({ className }: { className?: string }) {
  const {
    userCourses,
    userCourseMembers,
    selectedCourseId,
    courseMembersOfSelectedCourse
  } = useCourseContext();
  const params = useParams();
  const school = params['school'];

  const [open, setOpen] = React.useState(false);
  const [showNewCourseSheet, setShowNewCourseSheet] = React.useState(false);

  const uniqueRoles = [
    ...new Set(
      userCourseMembers ? userCourseMembers.map((item) => item.role) : []
    )
  ]
    .sort()
    .reverse();

  const selectedCourse = userCourses?.find(
    (course) => course.id === selectedCourseId
  );

  return (
    <>
      <CourseCreationSheet
        showNewCourseSheet={showNewCourseSheet}
        onOpenChange={setShowNewCourseSheet}
      />
      <Popover open={open} onOpenChange={setOpen}>
        {selectedCourse &&
        userCourses &&
        userCourses?.length > 0 &&
        userCourseMembers &&
        userCourseMembers?.length > 0 ? (
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
                  src={`https://avatar.vercel.sh/${selectedCourse?.courseCode}.png`}
                  alt={selectedCourse?.courseCode}
                />
                <Skeleton className="h-5 w-5 rounded-full" />
              </Avatar>
              <span className="pr-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                {courseMembersOfSelectedCourse ? (
                  `${selectedCourse.name}`
                ) : (
                  <Loading name="Getting Course" />
                )}
              </span>
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        ) : (
          <Button variant="outline" onClick={() => setShowNewCourseSheet(true)}>
            <PlusCircledIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="hidden ml-2 sm:inline-block">Create Course</span>
          </Button>
        )}
        {selectedCourse &&
          userCourses &&
          userCourses.length > 0 &&
          userCourseMembers &&
          userCourseMembers.length > 0 && (
            <PopoverContent className="w-[320px] p-0 " align="start">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search Course..." />
                  <CommandEmpty>No Course found.</CommandEmpty>
                  {uniqueRoles.map((role) => (
                    <CommandGroup key={role} heading={formatString(role)}>
                      {userCourses.map((course) => (
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
                                selectedCourse?.id === course.id
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
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setShowNewCourseSheet(true);
                      }}
                    >
                      <PlusCircledIcon className="mr-2 h-5 w-5" />
                      Create Course
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          )}
      </Popover>
    </>
  );
}
