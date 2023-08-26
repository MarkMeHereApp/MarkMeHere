'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export function StartScanningButton() {
  const router = useRouter();
  const [isSpinning, setSpinning] = useState(false);

  const handleClick = () => {
    setSpinning(true);
    router.push('/scan/qr');
  };

  return (
    <Button onClick={handleClick}>
      {isSpinning && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {isSpinning ? 'Loading' : 'Use QR Code'}
    </Button>
  );
}
