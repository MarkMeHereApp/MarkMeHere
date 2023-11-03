import * as React from 'react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyableClipboard } from '@/components/general/copy-text';

import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';

export default async function SuccessfulDeployment({
  searchParams
}: {
  searchParams: {
    'deployment-dashboard-url': string;
    'deployment-url': string;
    'project-dashboard-url': string;
    'project-name': string;
    'repository-url': string;
  };
}) {
  if (!searchParams) {
    throw new Error('searchParams is undefined');
  }

  const {
    'deployment-dashboard-url': deploymentDashboardUrl,
    'deployment-url': deploymentUrl,
    'project-dashboard-url': projectDashboardUrl,
    'project-name': projectName,
    'repository-url': repositoryUrl
  } = searchParams;

  if (
    !deploymentDashboardUrl ||
    !deploymentUrl ||
    !projectDashboardUrl ||
    !projectName ||
    !repositoryUrl
  ) {
    throw new Error('One or more searchParams properties are undefined');
  }

  if (!process.env.DEMO_DEPLOYMENT_WEBHOOK) {
    throw new Error('DEMO_DEPLOYMENT_WEBHOOK Not Set!');
  }

  fetch(process.env.DEMO_DEPLOYMENT_WEBHOOK.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: JSON.stringify(searchParams)
    })
  }).catch((error) => {
    console.error('Error:', error);
  });
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[800px] ">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">
              You've Launched Mark Me Here!
            </CardTitle>
            <Link href={'/'}>
              <ContinueButton
                name="Go To Home Page"
                variant="outline"
                size={'sm'}
              ></ContinueButton>
            </Link>
          </div>
          <div className="py-6">
            <b>Please save the following links.</b> On your Vercel Dashboard you
            can change your domain or adjust other deployment settings. If you
            encounter any issues please Contact Us through our home page.
          </div>
          <div className="pb-6">
            Vercel Dashboard URL:
            <div>
              <CopyableClipboard textToCopy={projectDashboardUrl} />
            </div>
          </div>
          <div className="pb-6">
            App URL:
            <div>
              <CopyableClipboard textToCopy={deploymentUrl} />
            </div>
          </div>
          <Link href={deploymentUrl}>
            <ContinueButton name="Go To Your App"></ContinueButton>
          </Link>
        </CardHeader>
      </Card>
    </div>
  );

  return <></>;
}
