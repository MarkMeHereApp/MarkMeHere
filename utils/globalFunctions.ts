import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto from 'crypto';

export function formatString(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

// TThis is the generic success message
export function toastSuccess(
  successMessage: string,
  action?: ToastActionElement | undefined
) {
  toast({
    title: 'Success!',
    icon: 'success',
    description: successMessage,
    action: action
  });
}

export function encrypt(text: string) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY not set');
  }

  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY!),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY not set');
  }

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift()!, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY!),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
