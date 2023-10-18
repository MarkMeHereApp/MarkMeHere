'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { themeGlobals } from '@/utils/globalVariables';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const allThemes = themeGlobals.flatMap((theme) =>
    [theme.darkTheme, theme.lightTheme].filter(Boolean)
  );
  const filteredThemes: string[] = allThemes.filter(
    (theme): theme is string => theme !== undefined
  );
  return (
    <NextThemesProvider themes={filteredThemes} enableSystem={false} {...props}>
      {children}
    </NextThemesProvider>
  );
}
