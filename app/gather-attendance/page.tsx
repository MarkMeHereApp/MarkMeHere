"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push('/gather-attendance/qr');
    }
  }, [router]);

  return null; // or a loading spinner if you want to display something before the redirect
}