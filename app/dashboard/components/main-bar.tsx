'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { Course, CourseMember } from '@/utils/sharedTypes';
import { Separator } from '@/components/ui/separator';
import ProfileForm from '@/app/dashboard/components/class-creation-form';
import { createContext } from 'react';
import Search from '@/app/dashboard/components/search';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface CourseSwitcherProps extends PopoverTriggerProps {
  userCourses: Course[];
  userCourseMemberships: CourseMember[];
}

interface GlobalContextType {
  course: Course;
  courseMember: CourseMember;
}

const GlobalContext = createContext<GlobalContextType>({
  course: {
    id: '',
    courseLabel: '',
    name: '',
    lmsId: ''
  },
  courseMember: {
    id: '',
    name: '',
    courseId: '',
    email: '',
    role: ''
  }
});

export default function CourseSwitcher({
  className,
  userCourses: initialUserCourses,
  userCourseMemberships: initialUserCourseMemberships,
  children
}: CourseSwitcherProps) {
  const [userCourses, setUserCourses] =
    React.useState<Course[]>(initialUserCourses);
  const [userCourseMemberships, setUserCourseMemberships] = React.useState<
    CourseMember[]
  >(initialUserCourseMemberships);
  const [open, setOpen] = React.useState(false);
  const [showNewCourseSheet, setShowNewCourseSheet] = React.useState(false);
  const defaultCourse: Course = {
    id: 'temp',
    courseLabel: 'temp',
    name: 'temp',
    lmsId: 'temp'
  };
  const defaultCourseMember: CourseMember = {
    id: 'temp',
    name: 'temp',
    courseId: 'temp',
    email: 'temp',
    role: 'temp'
  };

  const uniqueRoles = [
    ...new Set(userCourseMemberships.map((item) => item.role))
  ].sort();

  const [selectedCourse, setSelectedCourse] = React.useState<Course>(
    userCourses && userCourses.length > 0 ? userCourses[0] : defaultCourse
  );

  const [selectedCourseMember, setSelectedCourseMember] =
    React.useState<CourseMember>(defaultCourseMember);

  const [maxHeight, setMaxHeight] = React.useState('calc(80vh - 10rem)');

  React.useEffect(() => {
    if (window.innerWidth <= 768) {
      setMaxHeight('calc(100vh - 10rem)');
    } else {
      setMaxHeight('calc(100vh - 10rem)');
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{ course: selectedCourse, courseMember: selectedCourseMember }}
    >
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Sheet open={showNewCourseSheet} onOpenChange={setShowNewCourseSheet}>
            <Popover open={open} onOpenChange={setOpen}>
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
                      src={`https://avatar.vercel.sh/${selectedCourse.id}.png`}
                      alt={selectedCourse.name}
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {selectedCourse.name}
                  <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
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
                              setSelectedCourse(course);
                              const courseMember = userCourseMemberships.find(
                                (member) => member.courseId === course.id
                              );
                              setSelectedCourseMember(
                                courseMember || defaultCourseMember
                              );

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
                              <AvatarFallback>SC</AvatarFallback>
                            </Avatar>
                            {course.name}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                selectedCourse.id === course.id
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
                  onSuccess={(newCourse, newCourseMembership) => {
                    if (newCourseMembership !== null) {
                      setUserCourses((prevCourses) => [
                        ...prevCourses,
                        newCourse
                      ]);

                      // Add the new course member to userCourseMemberships

                      setUserCourseMemberships((prevMemberships) => [
                        ...prevMemberships,
                        newCourseMembership
                      ]);

                      // Set the selected course to the new course
                      setSelectedCourse(newCourse);

                      // Set the selected course member to the new course member
                      setSelectedCourseMember(newCourseMembership);
                    }
                    // Close the sheet
                    setShowNewCourseSheet(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => React.useContext(GlobalContext);
