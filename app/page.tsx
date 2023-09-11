'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkMeHereClassAnimation from '@/components/general/MarkMeHereClassAnimation';

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
      <MarkMeHereClassAnimation />
    </div>
  );
}
