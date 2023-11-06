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
              allowModeratorsGMaps={organization.allowModeratorsToUseGoogleMaps}
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
      <ScrollArea className="w-full rounded-md  sm:h-full md:h-[500px] ">
        <div className="space-y-6 pb-6">
          <h3 className="text-lg font-medium">
            Enter Email For Canvas Use. This can always be changed later in the
            admin settings.
          </h3>
          <p className="text-sm text-muted-foreground">
            To comply with the Canvas terms of service, only one user can
            manually enter a Canvas Developer token. Add the email of who you
            want your one user to be.
          </p>
        </div>
      </ScrollArea>
      <div className="flex justify-end py-4">
        <BackwardButton currentStep={props.currentStep} />
        <div className="ml-auto">
          <ForwardButton currentStep={props.currentStep} />
        </div>
      </div>
    </>
  ),
  (props: StepFunctionProps) => (
    <>
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
          <ManageSiteUsers />
        </div>
      </ScrollArea>
      <div className="flex justify-end py-4">
        <BackwardButton currentStep={props.currentStep} />
        <div className="ml-auto">
          <ForwardButton currentStep={props.currentStep} />
        </div>
      </div>
    </>
  ),
  async (props: StepFunctionProps) => {
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
            <AuthProviderSelector />
          </div>
          {user && (
            <>
              You Are Currently Logged in as <b>{user.name}</b> with the email{' '}
              <b>{user.email}</b>
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
    const session = await getServerSession();

    if (!session?.user?.email) {
      throw new Error('No session found');
    }

    const user = await prisma.user.findFirst({
      where: { email: session.user.email }
    });

    if (!user) {
      redirect(
        `/${props.organizationCode}/first-time-setup/${(
          props.currentStep - 1
        ).toString()}`
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
          <BackwardButton currentStep={props.currentStep} />`{' '}
          <div className="ml-auto">
            <FinishFirstTimeSetup />
          </div>
        </div>
      </>
    );
  }
];