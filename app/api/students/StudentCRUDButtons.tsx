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
import React, { useContext, useState } from 'react';
import { Student, UserType } from '@/utils/sharedTypes';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudentDataContext } from '@/app/providers';
import createRandomStudent from '@/utils/createRandomStudent';
import { studentDataAPI } from './studentDataAPI';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';

const AddRandomStudentButton = () => {
  const { students, setStudents } = useContext(StudentDataContext);

  const randomStudent = createRandomStudent();
  return (
    <Button
      variant="default"
      onClick={() => {
        studentDataAPI(students, setStudents).addStudent(randomStudent);
      }}
    >
      + Add Random Student to DB +
    </Button>
  );
};

const DeleteAllStudentsButton = () => {
  const { students, setStudents } = useContext(StudentDataContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  function handleConfirmDelete() {
    studentDataAPI(students, setStudents).deleteAllStudents();
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

const GetStudentsButton = () => {
  const { students, setStudents } = useContext(StudentDataContext);

  return (
    <Button
      variant="outline"
      onClick={() => studentDataAPI(students, setStudents).getStudents()}
    >
      Get Students (shows in inspect element)
    </Button>
  );
};

type ComponentWithOnClick<P = object> = React.FC<P & { onClick: () => void }>;
interface StudentEnrollmentFormProps {
  TriggerComponent: ComponentWithOnClick;
  existingStudentData?: Student;
}

export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({
  existingStudentData,
  TriggerComponent
}) => {
  const { students, setStudents } = useContext(StudentDataContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    form.reset();
    setIsDialogOpen(true);
  };

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

    studentDataAPI(students, setStudents).addStudent(studentData);
    toast({
      title: 'You enrolled the following student:',
      description: Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    });
    handleDialogClose();
  }

  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <TriggerComponent onClick={() => handleDialogOpen()} />
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onClose={() => setIsDialogOpen(false)}
        >
          <DialogHeader onClick={handleDialogClose}>
            <DialogTitle>Enroll Student</DialogTitle>
            <DialogDescription>
              Fill in the student&apos;s information below and click enroll when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                {...form.register('firstName')}
                defaultValue={existingStudentData?.firstName || ''}
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
                defaultValue={existingStudentData?.lastName || ''}
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
                defaultValue={existingStudentData?.email || ''}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Enroll Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

const EnrollNewStudentButton = () => {
  return <StudentEnrollmentForm TriggerComponent={ButtonWithOnClick} />;
};

const ButtonWithOnClick: ComponentWithOnClick = ({
  onClick,
  ...otherProps
}) => (
  <Button variant="default" onClick={onClick} {...otherProps}>
    Enroll a New Student
  </Button>
);

const StudentCRUDButtons = () => {
  return (
    <div className="flex flex-row gap-2">
      <AddRandomStudentButton />
      <DeleteAllStudentsButton />
      <GetStudentsButton />
      <EnrollNewStudentButton />
    </div>
  );
};

export default StudentCRUDButtons;
