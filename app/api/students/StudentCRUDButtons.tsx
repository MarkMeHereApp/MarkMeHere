import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { Student, UserType } from '@/utils/sharedTypes';
import {
  handleAddStudentClick,
  handleDeleteAllStudentsClick,
  handleGetStudentsClick
} from './reactClickHelpers';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import createRandomStudent from '@/utils/createRandomStudent';
import { faker } from '@faker-js/faker';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';

interface CRUDButtonsProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}
const AddRandomStudentButton: React.FC<CRUDButtonsProps> = ({
  setStudents
}) => {
  const randomStudent = createRandomStudent();

  return (
    <Button
      variant="default"
      onClick={() => {
        handleAddStudentClick(setStudents, randomStudent);
      }}
    >
      + Add Random Student to DB +
    </Button>
  );
};

const DeleteAllStudentsButton: React.FC<CRUDButtonsProps> = ({
  setStudents
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  function handleConfirmDelete() {
    handleDeleteAllStudentsClick(setStudents);
    handleDialogClose();
    toast({
      title: 'Successfully deleted all students'
    });
  }
  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" onClick={handleDialogOpen}>
            Delete All Students
          </Button>
        </DialogTrigger>
        <DialogContent onClose={() => handleDialogClose()}>
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Confirm Data Deletion</DialogTitle>
              <DialogDescription>
                This action is irreversible. Are you certain you wish to
                permanently delete all data related to your students?
              </DialogDescription>
            </DialogHeader>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirmDelete();
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
};

const GetStudentsButton: React.FC<CRUDButtonsProps> = ({ setStudents }) => (
  <Button variant="outline" onClick={() => handleGetStudentsClick(setStudents)}>
    Get Students (shows in inspect element)
  </Button>
);

interface StudentEnrollmentFormProps extends CRUDButtonsProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
  setIsDialogOpen,
  setStudents
}) => {
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const FormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email()
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const studentData: Student = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
      id: uuidv4(),
      userType: UserType.STUDENT,
      dateCreated: new Date(Date.now())
    };

    handleAddStudentClick(setStudents, studentData);
    toast({
      title: 'You enrolled the following student:',
      description: Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    });
    handleDialogClose();
  }

  const fakeData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email()
  };

  return (
    <>
      <DialogHeader onClick={handleDialogClose}>
        <DialogTitle>Enroll Student</DialogTitle>
        <DialogDescription>
          Fill in the student&apos;s information below and click enroll when
          you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="firstName" className="text-right">
            First Name
          </Label>
          <Input
            id="firstName"
            {...form.register('firstName')}
            defaultValue={fakeData.firstName}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Last Name
          </Label>
          <Input
            id="lastName"
            {...form.register('lastName')}
            defaultValue={fakeData.lastName}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            {...form.register('email')}
            defaultValue={fakeData.email}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button type="submit">Enroll Student</Button>
        </DialogFooter>
      </form>
    </>
  );
};

const EnrollNewStudentButton: React.FC<CRUDButtonsProps> = ({
  setStudents
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => handleDialogOpen()}>
            Enroll a New Student
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <StudentEnrollmentForm
            setStudents={setStudents}
            setIsDialogOpen={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const StudentCRUDButtons: React.FC<CRUDButtonsProps> = ({ setStudents }) => {
  return (
    <div className="flex flex-row gap-2">
      <AddRandomStudentButton setStudents={setStudents} />
      <DeleteAllStudentsButton setStudents={setStudents} />
      <GetStudentsButton setStudents={setStudents} />
      <EnrollNewStudentButton setStudents={setStudents} />
    </div>
  );
};

export default StudentCRUDButtons;
