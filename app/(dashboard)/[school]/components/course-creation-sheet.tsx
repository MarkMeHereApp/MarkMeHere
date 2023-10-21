// course-creation-sheet.tsx
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import ClassCreationForm from './course-creation/class-creation-form';

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
