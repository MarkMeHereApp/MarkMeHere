'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push('/dashboard/faculty/overview');
    }
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <ReloadIcon
        className="animate-spin"
        style={{ height: '100px', width: '100px' }}
      />
    </div>
  );
}
