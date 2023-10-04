import { Separator } from '@/components/ui/separator';
import AuthProviderSelector from './components/auth-provider-selection';
import prisma from '@/prisma';

export default async function SettingsAccountPage() {
  const authProviders = await prisma.authProviderCredentials.findMany({});
  const providerDisplayNames = authProviders.map(
    (provider) => provider.displayName
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Provider Setup</h3>
        <p className="text-sm text-muted-foreground">
          Add custom OAuth providers on this page. Please read our documentation
          for more info.
        </p>
      </div>
      <Separator />
      <AuthProviderSelector activeAuthProviders={providerDisplayNames} />
    </div>
  );
}
