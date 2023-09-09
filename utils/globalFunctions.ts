import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import { TRPCClientError } from '@trpc/client';

export function formatString(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function throwErrorOrShowToast(error: Error) {
  if (!(error instanceof TRPCClientError)) {
    throw error;
  }

  if (error.shape?.data?.toastError) {
    toastError(error.message);
    return;
  }

  throw error;
}

// These are errors that are expected: duplicate course, already enrolled, etc.
export function toastError(error: string, action?: ToastActionElement) {
  toast({
    title: 'Error',
    icon: 'error_for_destructive_toasts',
    variant: 'destructive',
    description: error,
    action: action
  });
}

// These are warnings that are expected.
export function toastWarning(
  warning: string,
  action?: ToastActionElement | undefined
) {
  toast({
    title: 'Warning',
    icon: 'warning',
    description: warning,
    action: action
  });
}
