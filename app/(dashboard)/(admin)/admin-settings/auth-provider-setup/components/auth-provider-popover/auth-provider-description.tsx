import { DialogDescription } from '@/components/ui/dialog';
import { CopyableClipboard } from '@/components/general/copy-text';

type ProviderDescriptionProps = {
  data: {
    creationLink?: string;
    displayName?: string;
    key?: string;
  };
};

export function AuthProviderDescription({ data }: ProviderDescriptionProps) {
  return (
    <DialogDescription>
      <a href={data?.creationLink}>
        <b className="text-primary">Click here</b>
      </a>{' '}
      to create the OAuth application through {data?.displayName}. Click save
      when you're done.
      <div className="py-2">
        <p className="py-1">Use the following as the homepage URL:</p>
        <CopyableClipboard textToCopy={`${process.env.NEXT_PUBLIC_BASE_URL}`} />
      </div>
      <div className="py-2">
        <p className="py-1">Use the following as the callback URL:</p>
        <CopyableClipboard
          textToCopy={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/${data?.key}`}
        />
      </div>
    </DialogDescription>
  );
}
