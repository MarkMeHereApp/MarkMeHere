import { Organization } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { SelectTheme } from '@/app/(dashboard)/[organizationCode]/(admin)/admin-settings/components/theme-selector/theme-selector';
import { EditGoogleMapsKey } from '../../../(admin)/admin-settings/components/google-maps/edit-google-maps-key';
import ManageSiteUsers from '../../../(admin)/manage-site-users/page';
import AuthProviderSelector from '../../../(admin)/admin-settings/components/auth-provider-components/auth-provider-selection';
import { ForwardButton } from '@/components/steps/forward-button';
import { BackwardButton } from '@/components/steps/backward-button';
import { LogOutSetupButton } from './log-out-to-finish-setup-button';
import { FinishFirstTimeSetup } from './finish-setup-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { getServerSession } from 'next-auth';
import prisma from '@/prisma';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { SkeletonButtonText } from '@/components/skeleton/skeleton-button';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';
import SignOutButton from './log-out-button';
import { zSiteRoles } from '@/types/sharedZodTypes';
import UsersContextProvider from '../../../(admin)/context-users';
import UserTable from '../../../(admin)/manage-site-users/UserTable';
import { columns } from '../../../(admin)/manage-site-users/columns';
import ConfigureAdminNextButton from './admin-step-next-button';
import { getEmailText } from '@/server/utils/userHelpers';
import { EditCanvasAuthorizedUser } from '../../../(admin)/admin-settings/components/canvas/edit-canvas-authorized-user';

const EnsureAdminInDatabase = async (organizationCode: string) => {
  // @TODO this needs to be a user in the organization
  const user = await prisma.user.findFirst({
    where: { role: zSiteRoles.enum.admin }
  });

  if (!user) {
    throw new Error(
      'There is no user in the database. You are on the wrong step.'
    );
  }
  return;
};

export const StepSkeleton = () => {
  return (
    <>
      <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
        <div className="space-y-6 pb-6">
          <div>
            <h3 className="pb-2">
              <Skeleton className="h-6 w-[250px]" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <Skeleton className="h-4 w-full" />
            </p>
          </div>
          <Separator />
        </div>
        <div className="pb-6">
          <Skeleton className="h-24 w-full " />
        </div>
        <div className="pb-6">
          <Skeleton className="h-16 w-[400px]" />
        </div>
        <Skeleton className="h-16 w-[400px]" />
      </ScrollArea>

      <div className="flex justify-end py-4">
        <SkeletonButtonText className="w-20" />

        <div className="ml-auto">
          <SkeletonButtonText className="w-20" />
        </div>
      </div>
    </>
  );
};

type StepFunctionProps = {
  organizationCode: string;
  currentStep: number;
};

type StepFunction = (
  props: StepFunctionProps
) => Promise<JSX.Element> | JSX.Element;

export const FirstTimeSteps: StepFunction[] = [
  async (props: StepFunctionProps) => {
    const organization = await prisma.organization.findFirst({
      where: { uniqueCode: props.organizationCode }
    });

    if (!organization) {
      throw new Error('No organization found!');
    }

    return (
      <>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px]">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium">
                First Configure your organization theme. This can always be
                changed later in the admin settings.
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
        </ScrollArea>
        <div className="flex justify-end py-4">
          <ForwardButton currentStep={props.currentStep} />
        </div>
      </>
    );
  },
  async (props: StepFunctionProps) => {
    const organization = await prisma.organization.findFirst({
      where: { uniqueCode: props.organizationCode }
    });

    if (!organization) {
      throw new Error('No organization found!');
    }
    return (
      <>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium">
                Configure Google Maps API. This can always be changed later in
                the admin settings.
              </h3>
              <p className="text-sm text-muted-foreground">
                Add a Google Maps API key to visualize geolocation data.
              </p>
            </div>
            <Separator />
            <EditGoogleMapsKey
              bHasConfigured={!!organization.googleMapsApiKey}
              allowUsersGMaps={organization.allowUsersToUseGoogleMaps}
            />
          </div>
        </ScrollArea>

        <div className="flex justify-end py-4">
          <BackwardButton currentStep={props.currentStep} />
          <div className="ml-auto">
            <ForwardButton currentStep={props.currentStep} />
          </div>
        </div>
      </>
    );
  },
  async (props: StepFunctionProps) => {
    const organization = await prisma.organization.findFirst({
      where: { uniqueCode: props.organizationCode }
    });

    if (!organization) {
      throw new Error('No organization found!');
    }
    return (
      <>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium">
                Configure Canvas Developer Key Authorization. This can always be
                changed later in the admin settings.
              </h3>
              <p className="text-sm text-muted-foreground">
                To comply with Canvas API requirements, you can only have one
                user that is allowed to use the Canvas Developer Key. Add the
                email of the user you want to authorize below.
              </p>
            </div>
            <Separator />
            <EditCanvasAuthorizedUser
              configuredEmail={organization.canvasDevKeyAuthorizedEmail}
              organizationCode={organization.uniqueCode}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end py-4">
          <BackwardButton currentStep={props.currentStep} />
          <div className="ml-auto">
            <ForwardButton currentStep={props.currentStep} />
          </div>
        </div>
      </>
    );
  },
  (props: StepFunctionProps) => (
    <>
      <UsersContextProvider>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px]">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              Add Your First Admin Account. This can always be changed later in
              the admin settings.
            </h3>
            <p className="text-sm text-muted-foreground">
              Once you log in with this user, you will have full access to the
              app!
            </p>
            <UserTable columns={columns} />
          </div>
        </ScrollArea>
        <div className="flex justify-end py-4">
          <BackwardButton currentStep={props.currentStep} />
          <div className="ml-auto">
            <ConfigureAdminNextButton currentStep={props.currentStep} />
          </div>
        </div>
      </UsersContextProvider>
    </>
  ),
  async (props: StepFunctionProps) => {
    // Make sure the user added an admin from step 3
    await EnsureAdminInDatabase(props.organizationCode);

    const session = await getServerSession();

    if (!session?.user?.email) {
      throw new Error('No session found');
    }

    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    });

    const ProviderNextStepButton = async () => {
      if (!user) {
        return (
          <LogOutSetupButton
            organizationCode={props.organizationCode}
            currentStep={props.currentStep}
            text={'Sign In To Your Provider To Continue'}
          />
        );
      }

      return (
        <>
          <span className="pr-4">
            <SignOutButton />
          </span>
          <ForwardButton currentStep={props.currentStep} />
        </>
      );
    };

    return (
      <>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium">Provider Setup</h3>
              <p className="text-sm text-muted-foreground">
                Add custom OAuth providers on this page. This will allow your
                users to sign in using platforms like GitHub, Google, or Zoom.
              </p>
            </div>
            <Separator />
            <AuthProviderSelector showSignOutTestConfirmation={false} />
          </div>
          {user && (
            <>
              You Are Currently Logged in as <b>{user.name}</b> with the email{' '}
              <b>{getEmailText(user.email)}</b>
            </>
          )}
        </ScrollArea>
        <div className="flex justify-end py-4">
          <BackwardButton currentStep={props.currentStep} />
          <div className="ml-auto">
            <Suspense fallback={<SkeletonButtonText className="w-20" />}>
              <ProviderNextStepButton />
            </Suspense>
          </div>
        </div>
      </>
    );
  },
  async (props: StepFunctionProps) => {
    // Make sure the user added an admin from step 3
    await EnsureAdminInDatabase(props.organizationCode);

    const session = await getServerSession();

    if (!session?.user?.email) {
      throw new Error('No session found');
    }

    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    });

    if (!user) {
      throw new Error(
        'There is no user in the database. You are on the wrong step.'
      );
    }
    return (
      <>
        <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-medium">Finish Setup</h3>
              <p className="text-sm text-muted-foreground">
                Click "Continue To App" to complete your setup!
              </p>
            </div>
            <Separator />
            <div className="flex flex-col items-center">
              <CheckCircledIcon className="text-primary w-32 h-32" />
              <p className="text-center mt-4">
                You've Finished Setting Up Mark Me Here!
              </p>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-end py-4">
          <BackwardButton currentStep={props.currentStep} />
          <div className="ml-auto">
            <FinishFirstTimeSetup organizationCode={props.organizationCode} />
          </div>
        </div>
      </>
    );
  }
];
