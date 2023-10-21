'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the useRouter hook

const StepButton = ({
  stepComplete,
  url,
  firstEntry,
  lastEntry
}: {
  stepComplete: boolean;
  url: string;
  firstEntry?: boolean;
  lastEntry?: boolean;
}) => {
  const pathname = usePathname();

  const selected = () => {
    return pathname === url;
  };

  return (
    <div>
      <Link href={url}>
        <Button variant={selected() ? 'default' : 'ghost'} size="icon">
          {stepComplete ? (
            <CheckCircledIcon className="w-5 h-5" />
          ) : (
            <CircleIcon className="w-5 h-5" />
          )}
        </Button>
      </Link>
    </div>
  );
};

export default StepButton;
