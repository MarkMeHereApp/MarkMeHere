'use client';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DataTable } from './table';
const SamsTestPage = () => {
  const data = useCourseContext();
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [tableValues, setTableValues] = useState<string[][]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [isDialogOpen, setDialogOpen] = useState(false);
  interface CSVData {
    [key: string]: string;
  }

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      Papa.parse<CSVData>(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const columnsArray: string[][] = [];
          const valuesArray: string[][] = [];

          results.data.forEach((d) => {
            columnsArray.push(Object.keys(d));
            valuesArray.push(Object.values(d));
          });

          setTableColumns(columnsArray[0]);
          setTableValues(valuesArray);
          setIsFileUploaded(true);
        }
      });
    } else {
      setIsFileUploaded(false);
    }
  };
  const handleButtonClick = async () => {
    if (data.selectedCourseId === null) return;
    const newMembers = await createManyCourseMembers.mutateAsync({
      courseId: data.selectedCourseId,
      courseMembers: [
        {
          name: 'Test',
          email: 'test@example.com',
          role: 'student'
        },
        {
          name: 'Test2',
          email: 'test2@example.com',
          role: 'student'
        }
      ]
    });

    data.setCourseMembersOfSelectedCourse(newMembers.allCourseMembersOfClass);
  };

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
      <Input id="csv" type="file" accept=".csv" onChange={handleFileChange} />
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={!isFileUploaded} onClick={openDialog}>
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Import CSV</DialogTitle>
            <DialogDescription>
              Review your CSV file here, click import when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <DataTable data={tableValues} courseID={data.selectedCourseId} />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit">Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SamsTestPage;
