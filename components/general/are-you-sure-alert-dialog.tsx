'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export function ConfirmDeleteDialog({
  title,
  description,
  onConfirm,
  children
}: {
  title: string;
  description?: string;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAwaitingConfirmationPromise, setAwaitingConfirmationPromise] =
    useState(false);
  const isConfirmed = inputValue.toUpperCase() === 'I AM SURE';

  const handleConfirm = async () => {
    setAwaitingConfirmationPromise(true);
    await onConfirm();
    setIsOpen(false);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setInputValue('');
        setAwaitingConfirmationPromise(false);
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex">
              <ExclamationTriangleIcon className="text-primary mr-2 mt-1 w-5 h-5" />
              {title}
            </div>
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          <AlertDialogDescription>
            <b>If you want to proceed type 'I AM SURE'.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type 'I AM SURE' to confirm"
          disabled={isAwaitingConfirmationPromise}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmed || isAwaitingConfirmationPromise}
          >
            {isAwaitingConfirmationPromise ? 'Loading...' : 'Confirm'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
