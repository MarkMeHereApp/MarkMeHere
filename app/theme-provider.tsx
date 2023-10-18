'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { lightThemes, darkThemes } from '@/types/sharedZodTypes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const allThemes = [...lightThemes, ...darkThemes, 'dark_yellow', 'dark_red'];
  return (
    <NextThemesProvider themes={allThemes} enableSystem={false} {...props}>
      {children}
    </NextThemesProvider>
  );
}
