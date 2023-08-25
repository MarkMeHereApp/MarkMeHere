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
  handleAddRandomStudentClick,
  handleDeleteAllStudentsClick,
  handleGetStudentsClick
} from './reactClickHelpers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Student } from '@/utils/sharedTypes';

const AddRandomStudentButton: React.FC<CRUDButtonsProps> = ({
  setStateAction
}) => {
  return (
    <Button
      variant="default"
      onClick={() => handleAddRandomStudentClick(setStateAction)}
    >
      + Add Random Student to DB +
    </Button>
  );
};

const DeleteAllStudentsButton: React.FC<CRUDButtonsProps> = ({
  setStateAction
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive">Delete All Students</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          delete all your students' data?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="destructive"
          onClick={() => handleDeleteAllStudentsClick(setStateAction)}
        >
          Yes, I want to delete all my students' data.
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const GetStudentsButton: React.FC<CRUDButtonsProps> = ({ setStateAction }) => (
  <Button
    variant="outline"
    onClick={() => handleGetStudentsClick(setStateAction)}
  >
    Get Students (shows in inspect element)
  </Button>
);

const AddStudentButton: React.FC<CRUDButtonsProps> = ({
  setStateAction,
  studentData
}) => {
  return <Button variant="default">Add Student</Button>;
};

interface CRUDButtonsProps {
  setStateAction: React.Dispatch<React.SetStateAction<Student[]>>;
  studentData?: Student;
}

const CRUDButtons: React.FC<CRUDButtonsProps> = ({ setStateAction }) => {
  return (
    <div className="flex flex-row gap-2">
      <AddRandomStudentButton setStateAction={setStateAction} />
      <DeleteAllStudentsButton setStateAction={setStateAction} />
      <GetStudentsButton setStateAction={setStateAction} />
      <AddStudentButton setStateAction={setStateAction} />
    </div>
  );
};

export default CRUDButtons;
