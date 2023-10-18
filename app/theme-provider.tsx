'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      themes={[
        'dark_zinc',
        'light_zinc',
        'dark_slate',
        'light_slate',
        'dark_stone',
        'light_stone',
        'dark_gray',
        'light_gray',
        'dark_neutral',
        'light_neutral',
        'dark_red',
        'light_red',
        'dark_rose',
        'light_rose',
        'dark_orange',
        'light_orange',
        'dark_green',
        'light_green',
        'dark_blue',
        'light_blue',
        'dark_yellow',
        'light_yellow',
        'dark_purple',
        'light_purple'
      ]}
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
