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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { Separator } from '@/components/ui/separator';
import ProfileForm from '@/app/dashboard/components/class-creation-form';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';

import { useCourseContext } from '@/app/course-context';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function CourseSwitcher({ className }: { className?: string }) {
  const {
    userCourses,
    setUserCourses,
    userCourseMembers,
    setUserCourseMembers,
    selectedCourseId,
    setSelectedCourseId
  } = useCourseContext();

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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet open={showNewCourseSheet} onOpenChange={setShowNewCourseSheet}>
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
                  className={cn('w-[200px] justify-between', className)}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${selectedCourse?.id}.png`}
                      alt={selectedCourse?.name}
                    />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </Avatar>
                  {selectedCourse?.name}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowNewCourseSheet(true)}
              >
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Create Course
              </Button>
            )}
            {selectedCourse &&
              userCourses &&
              userCourses.length > 0 &&
              userCourseMembers &&
              userCourseMembers.length > 0 && (
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Search Course..." />
                      <CommandEmpty>No Course found.</CommandEmpty>
                      {uniqueRoles.map((role) => (
                        <CommandGroup
                          key={role}
                          heading={role.charAt(0).toUpperCase() + role.slice(1)}
                        >
                          {userCourses.map((course) => (
                            <CommandItem
                              key={course.id}
                              onSelect={() => {
                                setSelectedCourseId(course.id);
                                setOpen(false);
                              }}
                              className="text-sm"
                            >
                              <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage
                                  src={`https://avatar.vercel.sh/${course.id}.png`}
                                  alt={course.name}
                                  className="grayscale"
                                />
                                <Skeleton className="h-5 w-5 rounded-full" />
                              </Avatar>
                              {course.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  selectedCourse?.id === course.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                      <CommandGroup>
                        <SheetTrigger asChild>
                          <CommandItem
                            onSelect={() => {
                              setOpen(false);
                              setShowNewCourseSheet(true);
                            }}
                          >
                            <PlusCircledIcon className="mr-2 h-5 w-5" />
                            Create Course
                          </CommandItem>
                        </SheetTrigger>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
          </Popover>
          <SheetContent side="left">
            <SheetHeader className="pb-2">
              <SheetTitle>Create Course</SheetTitle>
            </SheetHeader>
            <Separator />
            <div
              className="pt-4 scrollable-content"
              style={{
                maxHeight: 'calc(100vh - 6rem)',
                overflowY: 'auto',
                paddingRight: '15px',
                boxSizing: 'content-box',
                width: 'calc(100% - 15px)'
              }}
            >
              <ProfileForm
                onSuccess={() => {
                  setShowNewCourseSheet(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
