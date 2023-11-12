import { Separator } from '@/components/ui/separator';
import { CanvasSetup } from './canvas-setup';
import { getOrganization } from '@/data/organization/organization';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { hasCanvasConfigured } from '@/data/user/canvas';

export const CanvasComponent = async ({
  params
}: {
  params: { organizationCode: string };
}) => {
  const organization = await getOrganization(params.organizationCode);
  const { canvasDevKeyAuthorizedEmail } = organization;

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  const bCanvasConfigured = await hasCanvasConfigured();

  if (session?.user.email !== canvasDevKeyAuthorizedEmail) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Canvas Developer Token</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          You are not authrorized to add a Canvas Developer Token. Please visit
          your organization's admin settings to add an authorization.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Canvas Developer Token</h3>
        <p className="text-sm text-muted-foreground">
          You can add your Canvas Developer Token here. With this token, you can
          sync your Canvas courses with this site.
        </p>
      </div>
      <Separator />
      <CanvasSetup
        canvasConfigured={bCanvasConfigured}
        organizationCode={params.organizationCode}
      />
    </div>
  );
};
