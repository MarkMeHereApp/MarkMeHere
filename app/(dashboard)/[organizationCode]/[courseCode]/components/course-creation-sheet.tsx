'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetTrigger
} from '@/components/ui/sheet';
import ClassCreationForm from '../../components/course-creation/class-creation-form';
import { PlusCircledIcon } from '@radix-ui/react-icons';

export const CourseCreationSheet = () => {
  const [showNewCourseSheet, setShowNewCourseSheet] = React.useState(false);

  const toggleSheet = () => {
    setShowNewCourseSheet(!showNewCourseSheet);
  };

  return (
    <Sheet open={showNewCourseSheet} onOpenChange={setShowNewCourseSheet}>
      <SheetTrigger asChild onClick={toggleSheet}>
        <Button variant="outline" className="w-full border-none rounded-none">
          {' '}
          <PlusCircledIcon className="mr-2 h-5 w-5" />
          Create Course
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="pb-2">
          <SheetTitle
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Create Course
          </SheetTitle>
        </SheetHeader>
        <div
          className="pt-4 pb-4 scrollable-content"
          style={{
            maxHeight: 'calc(100vh - 6rem)',
            overflowY: 'auto',
            paddingRight: '15px',
            boxSizing: 'content-box',
            width: 'calc(100% - 15px)'
          }}
        >
          <ClassCreationForm
            onSuccess={() => {
              setShowNewCourseSheet(false);
            }}
          />

          {/* Add an empty space div */}
          <div style={{ height: '200px' }}></div>
        </div>

        <SheetFooter>
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
