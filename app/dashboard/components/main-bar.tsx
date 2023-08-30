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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import { Course } from '@/utils/sharedTypes';
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
  groups: Course[];
}

const GlobalContext = createContext<Course>({
  id: '',
  name: '',
  role: ''
});

export default function CourseSwitcher({
  className,
  groups,
  children
}: CourseSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewCourseDialog, setShowNewCourseDialog] = React.useState(false);
  const defaultCourse: Course = { id: 'temp', name: 'temp', role: 'temp' };
  const [selectedCourse, setSelectedCourse] = React.useState<Course>(
    groups && groups.length > 0 ? groups[0] : defaultCourse
  );
  const [maxHeight, setMaxHeight] = React.useState('calc(80vh - 10rem)');

  React.useEffect(() => {
    if (window.innerWidth <= 768) {
      setMaxHeight('calc(100vh - 10rem)');
    } else {
      setMaxHeight('calc(80vh - 10rem)');
    }
  }, []);

  return (
    <GlobalContext.Provider value={selectedCourse}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Dialog
            open={showNewCourseDialog}
            onOpenChange={setShowNewCourseDialog}
          >
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
                      src={`https://avatar.vercel.sh/${selectedCourse.value}.png`}
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
                    {(groups || []).map((group) => (
                      <CommandGroup
                        key={group.role}
                        heading={
                          group.role.charAt(0).toUpperCase() +
                          group.role.slice(1)
                        }
                      >
                        {groups.map((course) => (
                          <CommandItem
                            key={course.id}
                            onSelect={() => {
                              setSelectedCourse(course);
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
                      <DialogTrigger asChild>
                        <CommandItem
                          onSelect={() => {
                            setOpen(false);
                            setShowNewCourseDialog(true);
                          }}
                        >
                          <PlusCircledIcon className="mr-2 h-5 w-5" />
                          Create Course
                        </CommandItem>
                      </DialogTrigger>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Course</DialogTitle>
                <DialogDescription>
                  Add a new Course to manage products and customers.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <div
                className="scrollable-content"
                style={{
                  maxHeight: maxHeight,
                  overflowY: 'auto',
                  paddingRight: '15px',
                  boxSizing: 'content-box',
                  width: 'calc(100% - 15px)'
                }}
              >
                <ProfileForm />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNewCourseDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
