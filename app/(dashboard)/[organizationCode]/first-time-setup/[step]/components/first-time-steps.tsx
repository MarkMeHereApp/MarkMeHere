import { Organization } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { SelectTheme } from '@/app/(dashboard)/[organizationCode]/(admin)/admin-settings/components/theme-selector/theme-selector';
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
  )
];
