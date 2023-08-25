import {
  handleAddRandomStudentClick,
  handleDeleteAllStudentsClick,
  handleGetStudentsClick
} from './reactClickHelpers';

import { Button } from '@/components/ui/button';
import React from 'react';
import { Student } from '@/utils/sharedTypes';

interface CRUDButtonsProps {
  setStateAction: React.Dispatch<React.SetStateAction<Student[]>>;
}

const CRUDButtons: React.FC<CRUDButtonsProps> = ({ setStateAction }) => {
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="default"
        onClick={() => handleAddRandomStudentClick(setStateAction)}
      >
        + Add Random Student to DB +
      </Button>
      <Button
        variant="destructive"
        onClick={() => handleDeleteAllStudentsClick(setStateAction)}
      >
        Delete All Students
      </Button>
      <Button
        variant="outline"
        onClick={() => handleGetStudentsClick(setStateAction)}
      >
        Get Students (shows in inspect element)
      </Button>
    </div>
  );
};

export default CRUDButtons;
