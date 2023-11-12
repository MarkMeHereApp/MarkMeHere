import { Separator } from '@/components/ui/separator';
import AuthProviderSelector from './components/auth-provider-components/auth-provider-selection';
import { EditGoogleMapsKey } from './components/google-maps/edit-google-maps-key';
import { SelectTheme } from './components/theme-selector/theme-selector';
import { getOrganization } from '@/data/organization/organization';
import { EditCanvasAuthorizedUser } from './components/canvas/edit-canvas-authorized-user';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  const organization = await getOrganization(params.organizationCode);
  const {
    allowUsersToUseGoogleMaps,
    canvasDevKeyAuthorizedEmail,
    darkTheme,
    lightTheme
  } = organization;

  const hasGoogleMapsKey = !!organization.googleMapsApiKey;

  return (
    <>
      <div className="space-y-6 pb-24">
        <div>
          <h3 className="text-lg font-medium">Provider Setup</h3>
          <p className="text-sm text-muted-foreground">
            Add custom OAuth providers on this page. This will allow your users
            to sign in using platforms like GitHub, Google, or Zoom.
          </p>
        </div>
        <Separator />
        <AuthProviderSelector />
      </div>
      <div className="space-y-6 pb-24">
        <div>
          <h3 className="text-lg font-medium">
            Configure Canvas Developer Key Authorization
          </h3>
          <p className="text-sm text-muted-foreground">
            To comply with Canvas API requirements, you can only have one user
            that is allowed to use the Canvas Developer Key. Add the email of
            the user you want to authorize below.
          </p>
        </div>
        <Separator />
        <EditCanvasAuthorizedUser
          configuredEmail={canvasDevKeyAuthorizedEmail}
          organizationCode={params.organizationCode}
        />
      </div>
      <div className="space-y-6 pb-24">
        <div>
          <h3 className="text-lg font-medium">Configure Google Maps API</h3>
          <p className="text-sm text-muted-foreground">
            Add a Google Maps API key to visualize geolocation data.
          </p>
        </div>
        <Separator />
        <EditGoogleMapsKey
          bHasConfigured={hasGoogleMapsKey}
          allowUsersGMaps={allowUsersToUseGoogleMaps}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Configure School Theme.</h3>
          <p className="text-sm text-muted-foreground">
            Choose a dark color and light color!
          </p>
        </div>
        <Separator />
        <SelectTheme currentThemeFromDB={lightTheme} currentThemeType="light" />
        <SelectTheme currentThemeFromDB={darkTheme} currentThemeType="dark" />
      </div>
    </>
  );
}
