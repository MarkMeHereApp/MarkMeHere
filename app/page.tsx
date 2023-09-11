'use client';

import { Icons } from '@/components/ui/icons';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { firaSansFont } from '@/utils/fonts';
const LoadingState = () => {
  return (
    <div className="pt-8 flex flex-col items-center justify-center">
      <div className="flex space-x-0 items-center">
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '25px', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '50px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '100px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '150px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '100px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '50px', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '25px', height: 'auto' }}
        />
      </div>
      <span className={firaSansFont.className}>
        <h2 className="text-3xl font-logo tracking-tight font-bold">
          Mark Me Here!
        </h2>
      </span>
    </div>
  );
};

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
      <LoadingState />
    </div>
  );
}
