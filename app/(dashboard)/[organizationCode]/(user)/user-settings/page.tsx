import { Separator } from '@/components/ui/separator';
import ProfileForm from '../components/profile-form';
import { CanvasSetup } from '../components/canvas/canvas-setup';
import { getOrganization } from '@/data/organization/organization';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { CanvasComponent } from '../components/canvas/canvas-component';
import { Suspense } from 'react';
import { StepSkeleton } from '../../first-time-setup/[step]/components/first-time-steps';

export default async function UserSettings({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string };
}) {
  return (
    <Suspense>
      <CanvasComponent params={params} />
    </Suspense>
  );
}
