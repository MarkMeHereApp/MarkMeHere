import { studentDataAPI } from '@/app/api/students/studentDataAPI';
import { StudentDataContext } from '@/app/providers';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Student } from '@/utils/sharedTypes';
import { TrashIcon } from '@radix-ui/react-icons';

import { Row } from '@tanstack/react-table';
import { useContext, useState } from 'react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { students, setStudents } = useContext(StudentDataContext);

  const studentRowData = row.original as Student;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  async function handleConfirmDelete(selectedStudent: Student) {
    await studentDataAPI(students, setStudents).deleteStudent(selectedStudent);
    handleDialogClose();
    toast({
      title: `Successfully deleted ${selectedStudent.fullName}`
    });
  }
  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger onClick={() => handleDialogOpen()} asChild>
          <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700 transition-colors hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent onClose={() => handleDialogClose()}>
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Confirm Data Deletion</DialogTitle>
              <DialogDescription>
                This action is irreversible. Are you certain you wish to
                permanently delete all data related to{' '}
                <span className="underline text-red-500">
                  {studentRowData.fullName}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirmDelete(studentRowData);
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleDialogClose();
              }}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
