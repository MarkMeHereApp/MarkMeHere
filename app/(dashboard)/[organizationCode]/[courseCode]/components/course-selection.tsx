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
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useOrganizationContext } from '../../context-organization';
import { formatString } from '@/utils/globalFunctions';
import Link from 'next/link';
import { Course } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { Icons } from '@/components/ui/icons';

export default function CourseSelection() {
  const session = useSession();

  const {
    selectedCourseId,
    courseMembersOfSelectedCourse,
    userCourses,
    userCourseMembers,
    selectedCourse
  } = useCourseContext();

  const CanvasIcon = ({ enabled }: { enabled: boolean }) => {
    if (enabled) {
      return <Icons.canvas className="ml-auto h-4 w-4 text-destructive" />;
    }
    return <></>;
  };

  const { organizationUrl } = useOrganizationContext();

  const [open, setOpen] = React.useState(false);

  const uniqueRoles = [...new Set(userCourseMembers?.map((item) => item.role))]
    .sort()
    .reverse();

  const coursesWithKeys: { key: string; courses: Course[] }[] = uniqueRoles
    .concat('Not Enrolled')
    .map((role: string) => {
      const courses = userCourses.filter((course: Course) => {
        const courseMember = userCourseMembers.find(
          (member) => member.courseId === course.id
        );
        return courseMember
          ? courseMember.role === role
          : role === 'Not Enrolled';
      });
      return { key: role, courses };
    });

  if (!selectedCourse) {
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
                className={`pr-4 max-w-[72px] md:max-w-[118px] xl:max-w-[144px] whitespace-nowrap overflow-hidden overflow-ellipsis ${
                  courseMembersOfSelectedCourse ? '' : 'opacity-50'
                } transition-all`}
              >
                {selectedCourse.name}
              </span>
              <CanvasIcon enabled={!!selectedCourse.lmsId} />
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[320px] p-0 " align="start">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search Course..." />
                <CommandEmpty>No Course found.</CommandEmpty>
                {coursesWithKeys.map((uniqueRole) => {
                  if (uniqueRole.courses.length > 0) {
                    return (
                      <CommandGroup
                        key={uniqueRole.key}
                        heading={formatString(uniqueRole.key)}
                      >
                        {uniqueRole.courses.map((course) => {
                          return (
                            <Link
                              key={course.id}
                              href={`${organizationUrl}/${course.courseCode}`}
                            >
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
                                <CanvasIcon enabled={!!course.lmsId} />
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
                          );
                        })}
                      </CommandGroup>
                    );
                  }
                })}
              </CommandList>
              <CommandSeparator />
            </Command>
            {session.data?.user.role === zSiteRoles.enum.admin && (
              <CourseCreationSheet />
            )}
          </PopoverContent>
        </>
      </Popover>
    </>
  );
}
