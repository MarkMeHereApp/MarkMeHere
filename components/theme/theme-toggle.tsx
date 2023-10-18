'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ModeToggle({
  lightTheme,
  darkTheme
}: {
  lightTheme: string;
  darkTheme: string;
}) {
  const { theme, setTheme, themes, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
    if (lightTheme !== theme || darkTheme !== theme) {
      setTheme(darkTheme);
    }
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled={true}>
        <Skeleton className="w-full h-full" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme?.startsWith('dark_')) {
      setTheme(lightTheme);
      return;
    }
    setTheme(darkTheme);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === lightTheme && <Sun className="h-[1.2rem] w-[1.2rem] " />}
      {theme === darkTheme && (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] " />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
