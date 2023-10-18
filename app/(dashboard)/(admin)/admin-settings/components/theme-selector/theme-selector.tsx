'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { themeGlobals } from '@/utils/globalVariables';
import { formatString, toastSuccess } from '@/utils/globalFunctions';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { trpc } from '@/app/_trpc/client';

export function SelectTheme({
  currentThemeFromDB,
  currentThemeType
}: {
  currentThemeFromDB: string;
  currentThemeType: 'dark' | 'light';
}) {
  const [themeFromDB, setThemeFromDB] = useState<string>(currentThemeFromDB);
  const [selectedTheme, setSelectedTheme] =
    useState<string>(currentThemeFromDB);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { theme, setTheme } = useTheme();
  const updateSettings = trpc.siteSettings.updateSiteSettings.useMutation();
  const activeTheme = theme || currentThemeFromDB;

  if (error) {
    throw error;
  }

  const popOverName =
    currentThemeType === 'dark' ? 'Select Dark Theme' : 'Select Light Theme';

  const darkThemes = themeGlobals
    .map((theme) => theme.darkTheme)
    .filter((theme) => theme !== undefined);
  const lightThemes = themeGlobals
    .map((theme) => theme.lightTheme)
    .filter((theme) => theme !== undefined);

  const themes = currentThemeType === 'dark' ? darkThemes : lightThemes;

  const onChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme);
  };

  const resetTheme = () => {
    setSelectedTheme(currentThemeFromDB);
    setTheme(activeTheme);
  };

  const updateTheme = async () => {
    try {
      setLoading(true);
      if (currentThemeType === 'dark') {
        await updateSettings.mutateAsync({
          darkTheme: selectedTheme
        });
      } else {
        await updateSettings.mutateAsync({
          lightTheme: selectedTheme
        });
      }
      setThemeFromDB(selectedTheme);
      setLoading(false);
      toastSuccess('Theme updated successfully!');
      window.location.reload();
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <div>
      <Popover onOpenChange={resetTheme}>
        <PopoverTrigger asChild>
          <Button variant="outline">{popOverName}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{popOverName}</h4>
              <p className="text-sm text-muted-foreground">
                Set your theme for your school.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(
                (currTheme) =>
                  currTheme && (
                    <Button
                      key={currTheme}
                      variant={
                        selectedTheme === currTheme ? 'default' : 'outline'
                      }
                      className="m-1"
                      onClick={() => onChange(currTheme)}
                      disabled={loading}
                    >
                      {formatString(
                        currTheme.replace('dark_', '').replace('light_', '')
                      )}
                    </Button>
                  )
              )}
            </div>
            <Button
              disabled={selectedTheme === themeFromDB || loading}
              onClick={updateTheme}
            >
              {loading ? 'Updating...' : 'Submit'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
