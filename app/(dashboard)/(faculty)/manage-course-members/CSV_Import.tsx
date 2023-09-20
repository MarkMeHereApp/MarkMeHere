'use client';
import { useCourseContext } from '@/app/context-course';
import { trpc } from '@/app/_trpc/client';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
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
import { z, ZodError } from 'zod';

const CSV_Import = () => {
  const data = useCourseContext();
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [tableValues, setTableValues] = useState<string[][]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
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
      fileInputRef.current.value = '';
    }
  };

  const CSVSchema = z.object({
    ID: z.string(),
    Student: z.string().optional(),
    email: z.string().optional()
  });

  const validateCSV = async (headers: string[], values: CSVData[]) => {
    try {
      setValidationMessage('Validating CSV structure...');
      setValidationProgress(25);
      await delay(1000);
      setValidationMessage('Checking for required columns...');
      const requiredColumns = ['Student', 'ID'];
      for (const column of requiredColumns) {
        if (!headers.includes(column)) {
          throw Error(
            'CSV file is invalid, make sure Student and ID are included in the header.'
          );
        }
      }
      await delay(1000);
      setValidationProgress(50);
      setValidationMessage('Checking for required fields...');
      await delay(1000);
      setValidationProgress(75);
      await delay(3000);
      setValidationProgress(100);
      setValidationMessage('Validation completed!');
      await delay(3000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Validation failed. Try Again. '
      });
      setValidationProgress(0);
      setValidationMessage('CSV is not valid, please try again!');
      await delay(3000);
      setIsValidating(false);
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
        const lines = chunk.split('\n');
        const header = lines.shift();
        const filteredLines = lines.filter((line) => {
          const columns = line.split(',');
          const idColumn = columns[2];
          return idColumn !== '';
        });
        return [header, ...filteredLines].join('\n');
      },
      complete: async (results) => {
        const columnsToKeep = ['Student', 'ID', 'SIS Login ID']; // Replace with the column names you want to keep

        const filteredData = results.data.map((row) => {
          const filteredRow: CSVData = {};
          for (const column of columnsToKeep) {
            if (column in row) {
              filteredRow[column] = row[column];
            }
          }
          return filteredRow;
        });
        console.log(filteredData);

        setIsValidating(true);
        await validateCSV(columnsToKeep, filteredData);
        setIsValidating(false);

        setTableColumns(columnsToKeep);
        setTableValues(filteredData.map((row) => Object.values(row)));
      }
    });
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      parseCSV(selectedFile);
    } else {
      setIsFileUploaded(false);
    }
  };

  const handleImport = async () => {
    if (data.selectedCourseId === null) return;
    setIsImporting(true);
    const transformedTableValues = tableValues.map((row) => ({
      role: 'student',
      name: row[0],
      email: row[3] + '@ucf.edu',
      lmsId: row[1]
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
          description:
            'Added ' +
            newMembers.allCourseMembersOfClass.length +
            ' new members'
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
      throw new Error('error unable to import' + error);
    }
    setIsImporting(false);
  };

  return (
    <>
      {' '}
      <div className="grid max-w-sm items-center gap-1.5">
        <Input
          ref={fileInputRef}
          id="csv"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>
      <Dialog open={isFileUploaded}>
        <DialogContent className="sm:max-w-[1000px]" onClose={closeDialog}>
          <DialogHeader>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogDescription>
              Review your CSV file here, click import when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <CSV_Preview data={tableValues} />
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
                Import
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isValidating}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="text-center">
            <p style={{ color: 'green' }}>{validationMessage}</p>
            <Progress value={validationProgress} />{' '}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CSV_Import;
