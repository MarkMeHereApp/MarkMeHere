'use client';

import {
  toastError,
  toastSuccess,
  toastWarning
} from '@/utils/globalFunctions';
import { useEffect } from 'react';

export const Toast = ({
  type,
  text
}: {
  type: 'success' | 'error' | 'warning';
  text: string;
}) => {
  useEffect(() => {
    switch (type) {
      case 'success':
        toastSuccess(text);
        break;
      case 'error':
        toastError(text);
        break;
      case 'warning':
        toastWarning(text);
        break;
    }
  }, []);
  return <></>;
};

export default Toast;
