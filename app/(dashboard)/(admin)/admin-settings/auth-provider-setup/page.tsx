import { Separator } from '@/components/ui/separator';
import AuthProviderForm from './components/auth-provider-selection';

export default function SettingsAccountPage() {
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
      <AuthProviderForm />
    </div>
  );
}
