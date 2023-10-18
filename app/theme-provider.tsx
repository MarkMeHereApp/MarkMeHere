'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { lightThemes, darkThemes } from '@/types/sharedZodTypes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      themes={lightThemes.concat(darkThemes)}
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
