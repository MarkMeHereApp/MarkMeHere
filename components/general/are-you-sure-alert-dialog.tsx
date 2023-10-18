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
import Loading from '@/components/general/loading';
interface AreYouSureDialogProps {
  title?: string;
  AlertDescriptionComponent?: React.ComponentType;
  proceedText?: string;
  buttonText?: string;
  bDestructive?: boolean;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}

export function AreYouSureDialog({
  title,
  AlertDescriptionComponent,
  proceedText,
  buttonText,
  bDestructive,
  onConfirm,
  children
}: AreYouSureDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isAwaitingConfirmationPromise, setAwaitingConfirmationPromise] =
    useState(false);
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;

  const isConfirmed = proceedText
    ? inputValue.toUpperCase() === proceedText.toUpperCase()
    : true;

  const handleConfirm = async () => {
    try {
      setAwaitingConfirmationPromise(true);
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      setError(error as Error);
    }
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
          {title && (
            <AlertDialogTitle>
              <div className="flex">
                <ExclamationTriangleIcon className="text-primary mr-2 mt-1 w-5 h-5" />
                {title}
              </div>
            </AlertDialogTitle>
          )}

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
            variant={bDestructive ? 'destructive' : 'default'}
          >
            {isAwaitingConfirmationPromise ? (
              <Loading />
            ) : (
              `${buttonText || 'Confirm'}`
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
