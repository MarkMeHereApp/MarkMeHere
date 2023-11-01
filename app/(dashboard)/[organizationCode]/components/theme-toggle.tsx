'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';

export function ModeToggle() {
  const { theme, setTheme, themes } = useTheme();

  const { organization } = useOrganizationContext();

  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled={true}>
        <Skeleton className="w-full h-full" />
      </Button>
    );
  }

  const defaultLight = organization?.lightTheme || 'light_neutral';
  const defaultDark = organization?.darkTheme || 'dark_neutral';

  const toggleTheme = () => {
    if (theme?.startsWith('dark_')) {
      setTheme(defaultLight);
      return;
    }
    setTheme(defaultDark);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme?.startsWith('light_') && (
          <Sun className="h-[1.2rem] w-[1.2rem] " />
        )}
        {theme?.startsWith('dark_') && (
          <Moon className="absolute h-[1.2rem] w-[1.2rem] " />
        )}
      </Button>
    </>
  );
}

export default ModeToggle;
