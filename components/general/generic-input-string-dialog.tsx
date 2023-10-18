'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface InputStringDialogProps {
  title: string;
  onSubmit: (inputString: string) => Promise<void>;
  children: React.ReactNode;
  DescriptionComponent?: React.ComponentType;
}

export function InputStringDialog({
  title,
  onSubmit,
  children,
  DescriptionComponent
}: InputStringDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onSubmit(inputValue);
      setIsLoading(false);
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
      }}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        {DescriptionComponent && <DescriptionComponent />}
        <AlertDialogDescription>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
