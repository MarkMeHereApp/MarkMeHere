// course-creation-sheet.tsx
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import { ImportClassFromCanvas } from '@/app/dashboard/components/course-creation/import-class-from-canvas';
import ClassCreationForm from '@/app/dashboard/components/course-creation/class-creation-form';
import { Separator } from '@/components/ui/separator';
import { ImportClassFromCSV } from './course-creation/import-class-from-csv';

type CourseCreationSheetProps = {
  showNewCourseSheet: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CourseCreationSheet: React.FC<CourseCreationSheetProps> = ({
  showNewCourseSheet,
  onOpenChange
}) => {
  return (
    <Sheet open={showNewCourseSheet} onOpenChange={onOpenChange}>
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
              onOpenChange(false);
            }}
          />

          <Separator className="my-4" />
          <p className="pb-6">Or you can import with:</p>

          <div className="flex h-5 items-center space-x-4 text-sm justify-center">
            <ImportClassFromCanvas />
            <Separator orientation="vertical" className="mx-auto" />
            <ImportClassFromCSV />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
