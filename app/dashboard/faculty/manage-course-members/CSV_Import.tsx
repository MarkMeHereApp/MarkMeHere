'use client';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { Input } from '@/components/ui/input';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
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
  const handleImport = async () => {
    if (data.selectedCourseId === null) return;
    setIsImporting(true);
    const transformedTableValues = tableValues.map((row) => ({
      role: 'student',
      name: row[1],
      email: row[2],
      lmsId: row[0]
    }));
    try {
      const newMembers = await createManyCourseMembers.mutateAsync({
        courseId: data.selectedCourseId,
        courseMembers: transformedTableValues
      });
      if (newMembers.success) {
        toast({
          title: 'Imported CSV successfully'
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
      throw new Error('error unable to import' + error);
    }
    setIsImporting(false);
  };

  return (
    <>
      {' '}
      <div className="grid  max-w-sm items-center gap-1.5">
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
    </>
  );
};

export default CSV_Import;
