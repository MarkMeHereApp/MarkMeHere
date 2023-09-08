'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/toast';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  CrossCircledIcon,
  BookmarkFilledIcon
} from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zIconPresets } from '@/types/sharedZodTypes';

export function Toaster() {
  const { toasts } = useToast();

  type IconPresetsType = {
    [key: string]: JSX.Element | undefined;
  };

  const zIconPresetsDescriptions: Record<
    z.infer<typeof zIconPresets>,
    JSX.Element
  > = {
    success: <CheckCircledIcon className="mr-2 text-primary" />,
    warning: <ExclamationTriangleIcon className="mr-2 text-primary" />,
    error: <CrossCircledIcon className="mr-2  text-destructive" />,
    error_foreground: (
      <CrossCircledIcon className="mr-2  text-destructive-foreground" />
    ),
    bookmark: <BookmarkFilledIcon className="mr-2 text-primary" />
  };

  return (
    <ToastProvider>
      {toasts.map(({ id, title, icon, description, action, ...props }) => {
        let IconComponent = null;
        if (icon) {
          if (zIconPresetsDescriptions[icon]) {
            IconComponent = zIconPresetsDescriptions[icon];
          } else {
            IconComponent = (
              <span className="text-destructive"> INVALID ICON PROP </span>
            );
          }
        }
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  <span className="flex items-center">
                    {IconComponent}
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
