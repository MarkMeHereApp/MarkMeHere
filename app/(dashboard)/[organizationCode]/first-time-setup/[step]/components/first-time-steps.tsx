import { Organization } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { SelectTheme } from '@/app/(dashboard)/[organizationCode]/(admin)/admin-settings/components/theme-selector/theme-selector';
import { EditGoogleMapsKey } from '../../../(admin)/admin-settings/components/google-maps/edit-google-maps-key';
import ManageSiteUsers from '../../../(admin)/manage-site-users/page';
import AuthProviderSelector from '../../../(admin)/admin-settings/components/auth-provider-components/auth-provider-selection';

type StepFunction = ({
  organization
}: {
  organization: Organization;
}) => JSX.Element;

export const FirstTimeSteps: StepFunction[] = [
  ({ organization }: { organization: Organization }) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          First Configure your organization theme. This can always be changed
          later in the admin settings.
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose a dark color and light color!
        </p>
      </div>
      <Separator />
      <SelectTheme
        currentThemeFromDB={organization.lightTheme}
        currentThemeType="light"
      />
      <SelectTheme
        currentThemeFromDB={organization.darkTheme}
        currentThemeType="dark"
      />
    </div>
  ),
  ({ organization }: { organization: Organization }) => (
    <div className="space-y-6 pb-6">
      <div>
        <h3 className="text-lg font-medium">
          Configure Google Maps API. This can always be changed later in the
          admin settings.
        </h3>
        <p className="text-sm text-muted-foreground">
          Add a Google Maps API key to visualize geolocation data.
        </p>
      </div>
      <Separator />
      <EditGoogleMapsKey
        bHasConfigured={!!organization.googleMapsApiKey}
        allowUsersGMaps={organization.allowUsersToUseGoogleMaps}
        allowModeratorsGMaps={organization.allowModeratorsToUseGoogleMaps}
      />
    </div>
  ),
  ({ organization }: { organization: Organization }) => (
    <div className="space-y-6 pb-6">
      <div>
        <h3 className="text-lg font-medium">
          Enter Email For Canvas Use. This can always be changed later in the
          admin settings.
        </h3>
        <p className="text-sm text-muted-foreground">
          To comply with the Canvas terms of service, only one user can manually
          enter a Canvas Developer token. Add the email of who you want your one
          user to be.
        </p>
      </div>
    </div>
  ),
  ({ organization }: { organization: Organization }) => (
    <div className="space-y-6 pb-6">
      <div>
        <h3 className="text-lg font-medium">
          Add Your First Admin Account. This can always be changed later in the
          admin settings.
        </h3>
        <p className="text-sm text-muted-foreground">
          Once you log in with this user, you will have full access to the app!
        </p>
        <ManageSiteUsers />
      </div>
    </div>
  ),
  ({ organization }: { organization: Organization }) => (
    <div className="space-y-6 pb-6">
      <div>
        <h3 className="text-lg font-medium">Configure Sign In Methods</h3>
        <p className="text-sm text-muted-foreground">
          Add custom OAuth providers on this page. This will allow your users to
          sign in using platforms like GitHub, Google, or Zoom.
        </p>
      </div>
      <Separator />
      <AuthProviderSelector />
    </div>
  )
];
