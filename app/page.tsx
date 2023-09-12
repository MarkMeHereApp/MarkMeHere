'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push('/dashboard/faculty/overview');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <MarkMeHereClassAnimation />
    </div>
  );
}
