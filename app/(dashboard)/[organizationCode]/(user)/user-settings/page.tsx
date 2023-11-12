import { CanvasComponent } from '../components/canvas/canvas-component';
import { Suspense } from 'react';

export default async function UserSettings({
  params
}: {
  params: { organizationCode: string };
}) {
  return (
    <Suspense>
      <CanvasComponent params={params} />
    </Suspense>
  );
}
