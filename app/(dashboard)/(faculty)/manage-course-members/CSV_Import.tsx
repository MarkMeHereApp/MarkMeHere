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

const CSV_Import = () => {
  const data = useCourseContext();
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [tableValues, setTableValues] = useState<string[][]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationColor, setVlidationColor] = useState('');
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

  const validateCSV = async (headers: string[], values: CSVData[]) => {
    try {
      setVlidationColor('');
      setValidationProgress(0);
      setValidationMessage('Validating CSV structure...');
      await delay(1000);
      setValidationProgress(25);
      const firstObjectKeys = Object.keys(values[0]);
      if (JSON.stringify(firstObjectKeys) !== JSON.stringify(headers)) {
        throw new Error(`CSV file is invalid, keys do not match headers.`);
      }

      const requiredColumns = ['Student', 'ID'];
      const missingColumns: string[] = [];
      const missingValues: string[] = [];

      for (const column of requiredColumns) {
        // Check if any row in the values array is missing the required column

        setValidationMessage('Checking for required columns...');
        await delay(1000);

        if (!values.every((row) => column in row)) {
          missingColumns.push(column);
        }

        setValidationProgress(50);
        setValidationMessage('Checking for required fields...');
        await delay(1000);
        // Check if any row in the values array has a null or empty value for the required column
        if (
          !values.every((row) => row[column] !== null && row[column] !== '')
        ) {
          missingValues.push(column);
        }
      }

      if (missingColumns.length > 0) {
        throw new Error(
          `CSV file is invalid, missing columns: ${missingColumns.join(', ')}`
        );
      }

      if (missingValues.length > 0) {
        throw new Error(
          `CSV file is invalid, missing values for columns: ${missingValues.join(
            ', '
          )}`
        );
      }

      setValidationProgress(75);

      setValidationProgress(100);
      setVlidationColor('green');
      setValidationMessage('Validation completed!');
      await delay(1000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Validation failed. Try Again. '
      });
      setVlidationColor('red');
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
        const lines = chunk.split('\n');
        const header = lines.shift();
        const filteredLines = lines.filter((line) => {
          const columns = line.split(',');
          const idColumn = columns[3];
          return idColumn !== '';
        });
        return [header, ...filteredLines].join('\n');
      },
      complete: async (results) => {
        const columnsToKeep = ['Student', 'ID', 'SIS Login ID'];

        const filteredData = results.data.map((row) => {
          const filteredRow: CSVData = {};
          for (const column of columnsToKeep) {
            if (column in row) {
              filteredRow[column] = row[column];
            }
          }
          return filteredRow;
        });

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
      email: row[2] + '@ucf.edu',
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

      throw new Error('Error importing CSV: ' + error);
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
        <DialogContent className="sm:max-w-[425px]" onClose={closeDialog}>
          <div className="text-center">
            <p
              style={{
                color: validationColor,
                fontSize: '15px',
                fontWeight: 'bold'
              }}
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
              <div
                style={{
                  width: `${validationProgress}%`,
                  backgroundColor: validationColor,
                  height: '100%',
                  borderRadius: '10px'
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CSV_Import;
