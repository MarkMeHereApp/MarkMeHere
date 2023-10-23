'use client';

import * as React from 'react';
import { useState } from 'react';

import { createContext } from 'react';

type themeType = { light: string; dark: string };

interface SchoolContextType {
  schoolAbbreviation: string;
  setSchoolAbbreviation: React.Dispatch<React.SetStateAction<string>>;
  themes: themeType;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
}

const SchoolContext = createContext<SchoolContextType>({
  schoolAbbreviation: '',
  setSchoolAbbreviation: () => {},
  themes: { light: 'light_neutral', dark: 'dark_neutral' },
  setTheme: () => {}
});

export default function SchoolContextProvider({
  children,
  schoolAbbreviation: initialSchoolAbbreviation,
  themes: initialThemes
}: {
  children?: React.ReactNode;
  schoolAbbreviation: string;
  themes: themeType;
}) {
  const [schoolAbbreviation, setSchoolAbbreviation] = useState(
    initialSchoolAbbreviation
  );
  const [themes, setTheme] = useState(initialThemes);

  return (
    <SchoolContext.Provider
      value={{
        schoolAbbreviation,
        setSchoolAbbreviation,
        themes,
        setTheme
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchoolContext = () => React.useContext(SchoolContext);
