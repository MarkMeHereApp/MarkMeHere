import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';

export function formatString(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// These are errors that are expected: duplicate course, already enrolled, etc.
export function minimalError(
  error: string,
  action: ToastActionElement | undefined
) {
  toast({
    title: 'Error',
    icon: 'error_for_destructive_toasts',
    variant: 'destructive',
    description: error,
    action: action
  });
}

// These are warnings that are expected.
export function minimalWarning(
  warning: string,
  action: ToastActionElement | undefined
) {
  toast({
    title: 'Warning',
    icon: 'warning',
    description: warning,
    action: action
  });
}
