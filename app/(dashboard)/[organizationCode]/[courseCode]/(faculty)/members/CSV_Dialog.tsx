import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import CSV_Import from './CSV_Import';
import { Checkbox } from '@/components/ui/checkbox';
import { MdUploadFile } from 'react-icons/md';

export function CSV_Dialog() {
  const [checkboxes, setCheckboxes] = useState({
    terms1: false,
    terms2: false,
    terms3: false
  });
  const allChecked = Object.values(checkboxes).every((value) => value);
  const [dOpen, setDOpen] = useState(false);
  const closeParentDialog = () => {
    setDOpen(false);
  };

  return (
    <Dialog open={dOpen} onOpenChange={setDOpen}>
      <DialogTrigger asChild>
        <Button>
          <MdUploadFile className="h-5 w-4" />
          <span className="hidden sm:flex ml-2">Import CSV</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Please make sure your CSV file includes all the followings
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-9">
          <DialogDescription>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>

                <label
                  htmlFor="terms1"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 align-middle"
                >
                  File is type .csv
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <label
                  htmlFor="terms2"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 align-middle"
                >
                  CSV headers contain Name, Id, and Email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <label
                  htmlFor="terms3"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 align-middle"
                >
                  All Members are associated with an email address
                </label>
              </div>
            </div>
          </DialogDescription>
        </div>
        <DialogFooter>
          <CSV_Import onClose={closeParentDialog} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
