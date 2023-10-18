import { Separator } from '@/components/ui/separator';
import AuthProviderSelector from './components/auth-provider-components/auth-provider-selection';
import { EditGoogleMapsKey } from './components/google-maps/edit-google-maps-key';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { SelectTheme } from './components/theme-selector/theme-selector';
export default async function SettingsAccountPage() {
  const globalSiteSettings = await getGlobalSiteSettings_Server({
    allowModeratorsToUseGoogleMaps: true,
    allowUsersToUseGoogleMaps: true,
    googleMapsApiKey: true,
    darkTheme: true,
    lightTheme: true
  });
  const allowUsersGMaps = globalSiteSettings.allowUsersToUseGoogleMaps;
  const allowModeratorsGMaps =
    globalSiteSettings.allowModeratorsToUseGoogleMaps;

  const hasGoogleMapsKey = !!globalSiteSettings?.googleMapsApiKey;

  const darkTheme = globalSiteSettings.darkTheme;
  const lightTheme = globalSiteSettings.lightTheme;

  return (
    <>
      <div className="space-y-6 pb-6">
        <div>
          <h3 className="text-lg font-medium">Provider Setup</h3>
          <p className="text-sm text-muted-foreground">
            Add custom OAuth providers on this page. Please read our
            documentation for more info.
          </p>
        </div>
        <Separator />
        <AuthProviderSelector />
      </div>
      <div className="space-y-6 pb-6">
        <div>
          <h3 className="text-lg font-medium">Configure Google Maps API</h3>
          <p className="text-sm text-muted-foreground">
            Add a Google Maps API key to visualize geolocation data.
          </p>
        </div>
        <Separator />
        <EditGoogleMapsKey
          bHasConfigured={hasGoogleMapsKey}
          allowUsersGMaps={allowUsersGMaps}
          allowModeratorsGMaps={allowModeratorsGMaps}
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
