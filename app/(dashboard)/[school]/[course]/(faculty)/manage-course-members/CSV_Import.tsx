'use client';
import { useCourseContext } from '@/app/context-course';
import { trpc } from '@/app/_trpc/client';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { CourseMember } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { CSV_Preview } from './CSV_Preview';
import { BsUpload } from 'react-icons/bs';
import { MdUploadFile } from 'react-icons/md';
import { zCourseRoles } from '@/types/sharedZodTypes';

const CSV_Import = () => {
  const data = useCourseContext();
  const currentMembers = useCourseContext().courseMembersOfSelectedCourse;
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();
  const [tableValues, setTableValues] = useState<CourseMember[]>([]);
  const [existedMembers, setExistedMembers] = useState<CourseMember[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const { toast } = useToast();

  const [validationProgress, setValidationProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  interface CSVData {
    [key: string]: string;
  }

  const closeDialog = () => {
    if (fileInputRef.current) {
      setIsFileUploaded(false);
      setIsValidating(false);
      fileInputRef.current.value = '';
    }
  };
  const openConfirmationDialog = () => {
    setIsConfirmationDialogOpen(true);
  };
  const validateCSV = async (values: CSVData[]) => {
    try {
      setValidationProgress(0);
      setExistedMembers([]);
      setValidationMessage('Validating CSV structure...');
      await delay(1000);
      setValidationProgress(25);
      const firstObjectKeys = Object.keys(values[0]);

      const expectedHeaders = ['name', 'id', 'email'];

      const headersMatch = expectedHeaders.every((expectedHeader) =>
        firstObjectKeys.some(
          (header) =>
            header.trim().toLowerCase() === expectedHeader.toLowerCase()
        )
      );

      if (!headersMatch) {
        throw new Error(
          `CSV file is invalid. Make sure CSV includes headers: 'Name', 'ID', 'Email'.`
        );
      }

      const missingValues: string[] = [];

      for (const column of expectedHeaders) {
        setValidationProgress(50);
        setValidationMessage('Checking for required fields...');
        // Check if any row in the values array has a null or empty value for the required column
        if (
          !values.every((row) => row[column] !== null && row[column] !== '')
        ) {
          missingValues.push(column);
        }
      }

      if (missingValues.length > 0) {
        throw new Error(
          `CSV file is invalid, missing values for columns: ${missingValues.join(
            ', '
          )}`
        );
      }
      setValidationProgress(75);
      // check if the members already exist in the database
      setValidationMessage('Checking the members of the course...');

      const data = values.map((row) => ({
        id: row['id'],
        name: row['name'],
        optionalId: row['id'],
        email: row['email'],
        courseId: '',
        lmsId: '',
        dateEnrolled: new Date(),
        role: 'Student'
      }));
      if (currentMembers) {
        const existingMembers = currentMembers.filter(
          (member) =>
            member.optionalId &&
            data.some((row) => row.optionalId === member.optionalId)
        );

        if (existingMembers.length > 0) {
          setExistedMembers(existingMembers);
        }
      }

      setValidationProgress(100);
      setValidationMessage('Validation completed!');
      await delay(1000);

      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Validation failed. Try Again. '
      });
      setValidationProgress(0);
      setValidationMessage('' + error);
      await delay(10000);
      closeDialog();
    }
  };
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const parseCSV = (selectedFile: File) => {
    setIsFileUploaded(true);
    Papa.parse<CSVData>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      beforeFirstChunk: (chunk) => {
        const header = chunk.split('\n')[0].replace(/\s/g, '').toLowerCase();
        const lines = chunk.split('\n').slice(1);
        const filteredLines = lines.filter((line) => {
          const columns = line.split(',');
          const idColumn = columns[3];
          return idColumn !== '';
        });
        return [header, ...filteredLines].join('\n');
      },
      complete: async (results) => {
        const columnsToKeep = ['name', 'id', 'email'];

        const filteredData = results.data.map((row) => {
          const cleanedRow: CSVData = {};
          for (const column of columnsToKeep) {
            if (column in row) {
              const cleanedColumn = column.trim().replace(/"/g, '');
              const cleanedValue = row[column].trim().replace(/"/g, '');
              cleanedRow[cleanedColumn] = cleanedValue;
            }
          }
          return cleanedRow;
        });

        setIsValidating(true);

        const data = await validateCSV(filteredData);
        setIsValidating(false);

        setTableValues(data || []);
      }
    });
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      parseCSV(selectedFile);
    }
  };

  const handleImport = async () => {
    if (data.selectedCourseId === null) return;
    if (tableValues.length === 0) {
      toast({
        variant: 'destructive',
        title: 'There are no members to import!'
      });

      return;
    }
    setIsImporting(true);
    const transformedTableValues = tableValues.map((row) => ({
      role: zCourseRoles.enum.student,
      name: row.name,
      email: row.email,
      optionalId: row.optionalId !== null ? row.optionalId : undefined
    }));
    try {
      const newMembers = await createManyCourseMembers.mutateAsync({
        courseId: data.selectedCourseId,
        courseMembers: transformedTableValues
      });
      closeDialog();
      if (newMembers.success) {
        toast({
          title: 'Imported CSV successfully',
          icon: 'success',
          description: 'Added ' + tableValues.length + ' new members'
        });
        data.setCourseMembersOfSelectedCourse(
          newMembers.allCourseMembersOfClass
        );
      } else {
        setIsImporting(false);
        toast({
          variant: 'destructive',
          title: 'Importing CSV failed. Try Again. '
        });

        throw new Error('Unable to add new members');
      }
    } catch (error: unknown) {
      setIsImporting(false);
      toast({
        variant: 'destructive',
        title: 'Importing CSV failed. Try Again. ' + error
      });
      closeDialog();

      throw new Error('Error importing CSV: ' + error);
    }
    setIsImporting(false);
  };

  const removeAlreadyExistedMembers = () => {
    if (currentMembers) {
      const existingMembers = currentMembers.filter((member) =>
        tableValues.some((row) => row.optionalId === member.optionalId)
      );

      if (existingMembers.length > 0) {
        // Remove existing members from the tableValues state
        const newTableValues = tableValues.filter(
          (row) =>
            !existingMembers.some(
              (existingMember) => existingMember.optionalId === row.optionalId
            )
        );

        setTableValues(newTableValues);
        setExistedMembers([]);
      }
    }
  };

  return (
    <>
      {' '}
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        id="csv"
      />
      <label
        htmlFor="csv"
        className={
          'bg-primary cursor-pointer text-primary-foreground text-center hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center '
        }
      >
        <MdUploadFile className="h-5 w-4 mr-2" />
        Import CSV
      </label>
      <Dialog open={isValidating}>
        <DialogContent className="sm:max-w-[425px]" onClose={closeDialog}>
          <div className="text-center">
            <p
              style={{
                fontSize: '15px',
                fontWeight: 'bold'
              }}
              className="text-primary"
            >
              {validationMessage}
            </p>
            <div style={{ width: '80%', margin: '0 auto' }}>
              <Progress
                style={{
                  backgroundColor: '#ddd',
                  height: '20px',
                  borderRadius: '10px'
                }}
                value={validationProgress}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isFileUploaded}>
        <DialogContent
          className="sm:max-w-[1000px] flex flex-col flex-grow"
          onClose={closeDialog}
        >
          <DialogHeader>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogDescription>
              Review your CSV file here, click import when you're done.
            </DialogDescription>

            {existedMembers.length > 0 && (
              <DialogDescription
                style={{
                  color: 'red',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Members that are colored in red are already enrolled in the
                course would you like to remove them from CSV?
                <br />
                click Import if you like to overwrite them.
                <span style={{ flex: 1 }}></span>{' '}
                <Button
                  variant={'destructive'}
                  style={{ marginRight: '10px' }}
                  onClick={openConfirmationDialog}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Remove
                </Button>
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <CSV_Preview data={tableValues} existingMembers={existedMembers} />
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" onClick={closeDialog}>
                Cancel
              </Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button
                type="submit"
                onClick={handleImport}
                disabled={isImporting}
              >
                {isImporting && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!isImporting && <BsUpload className="h-5 w-4 mr-2" />}
                Import
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isConfirmationDialogOpen}>
        <DialogContent onClose={() => setIsConfirmationDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to remove existing members from CSV?
          </DialogDescription>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => setIsConfirmationDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                variant="default"
                onClick={() => {
                  removeAlreadyExistedMembers();
                  setIsConfirmationDialogOpen(false);
                }}
              >
                Confirm
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CSV_Import;
