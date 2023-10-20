import { DialogDescription } from '@/components/ui/dialog';
import { CopyableClipboard } from '@/components/general/copy-text';
import { Provider } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import { getPublicUrl } from '@/utils/globalFunctions';

export function AuthProviderDescription({ data }: { data: Provider }) {
  return (
    <DialogDescription>
      <a href={data?.docsLink}>
        <b className="text-primary">Click here</b>
      </a>{' '}
      to view the <b>{data?.defaultDisplayName}</b> documentation page. Click
      submit to upload the provider.
      <div className="py-2">
        <p className="py-1">Use the following as the homepage URL:</p>
        <CopyableClipboard textToCopy={`${getPublicUrl()}`} />
      </div>
      <div className="py-2">
        <p className="py-1">Use the following as the callback URL:</p>
        <CopyableClipboard
          textToCopy={`${getPublicUrl()}/api/auth/callback/${data?.key}`}
        />
      </div>
    </DialogDescription>
  );
}
