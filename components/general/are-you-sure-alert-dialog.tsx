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

interface AreYouSureDialogProps {
  title: string;
  AlertDescriptionComponent?: React.ComponentType;
  proceedText?: string;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}

export function AreYouSureDialog({
  title,
  AlertDescriptionComponent,
  proceedText,
  onConfirm,
  children
}: AreYouSureDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAwaitingConfirmationPromise, setAwaitingConfirmationPromise] =
    useState(false);
  const isConfirmed = proceedText
    ? inputValue.toUpperCase() === proceedText.toUpperCase()
    : true;

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
          {AlertDescriptionComponent && <AlertDescriptionComponent />}
        </AlertDialogHeader>
        {proceedText && (
          <div>
            <AlertDialogDescription className="pb-4">
              <b>
                If you want to proceed type '
                <span className="whitespace-pre inline">{proceedText}</span>'.
              </b>
            </AlertDialogDescription>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type '${proceedText}' to confirm`}
              disabled={isAwaitingConfirmationPromise}
            />
          </div>
        )}

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
