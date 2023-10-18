'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { formatString, toastSuccess } from '@/utils/globalFunctions';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { trpc } from '@/app/_trpc/client';
import Loading from '@/components/general/loading';

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
  const [reloadingPage, setReloadingPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { theme, setTheme, themes } = useTheme();
  const updateSettings = trpc.siteSettings.updateSiteSettings.useMutation();
  const activeTheme = theme || currentThemeFromDB;

  if (error) {
    throw error;
  }

  const currentThemes =
    currentThemeType === 'dark'
      ? themes.filter((theme) => theme.startsWith('dark_'))
      : themes.filter((theme) => theme.startsWith('light_'));

  const onChange = (theme: string) => {
    setSelectedTheme(theme);
    setTheme(theme);
  };

  const onOpen = (open: boolean) => {
    if (open) {
      setSelectedTheme(currentThemeFromDB);
      setTheme(currentThemeFromDB);
    } else {
      setSelectedTheme(currentThemeFromDB);
      setTheme(activeTheme);
    }
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
      toastSuccess('Theme updated successfully! Reloading page...');
      setReloadingPage(true);
      window.location.reload();
    } catch (error) {
      setError(error as Error);
    }
  };

  if (reloadingPage) {
    return <Loading name="Reloading Page" />;
  }

  return (
    <div>
      <Popover onOpenChange={onOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            Customize {formatString(currentThemeType)} Mode
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" side="right">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">
                Select {formatString(currentThemeType)} Theme
              </h4>
              <p className="text-sm text-muted-foreground">
                Set your {currentThemeType} theme for your school.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {currentThemes.map(
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
              {loading ? <Loading /> : 'Save'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
