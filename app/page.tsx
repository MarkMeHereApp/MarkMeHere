'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';
import { firaSansFont } from '@/utils/fonts';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push('/overview');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col items-center">
        <MarkMeHereClassAnimation />
        <span className={firaSansFont.className}>
          <h2 className="text-3xl font-bold">Mark Me Here!</h2>
        </span>
      </div>
    </div>
  );
}
