import { Separator } from '@/components/ui/separator';
import { SelectTheme } from '@/app/(dashboard)/[organizationCode]/(admin)/admin-settings/components/theme-selector/theme-selector';
import prisma from '@/prisma';

export default async function firstStep({
  params
}: {
  params: { organizationCode: string };
}) {
  const organization = await prisma.organization.findFirst({
    where: { uniqueCode: params.organizationCode },
    select: {
      darkTheme: true,
      lightTheme: true
    }
  });

  if (!organization) {
    throw new Error('No Organization Found!');
  }
  const darkTheme = organization.darkTheme;
  const lightTheme = organization.lightTheme;

  return (
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
      <SelectTheme currentThemeFromDB={lightTheme} currentThemeType="light" />
      <SelectTheme currentThemeFromDB={darkTheme} currentThemeType="dark" />
    </div>
  );
}
