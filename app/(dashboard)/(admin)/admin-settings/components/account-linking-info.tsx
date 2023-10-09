import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

export function AccountLinkingInfoHover() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <InfoCircledIcon />
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="flex justify-between space-y-1 text-sm">
          <p>
            <b>Account Linking</b> is a feature that enables users to connect
            their accounts from this provider to an already existing account on
            Mark Me Here! This is possible when both accounts share the same
            email address, even if they were created using different providers.
            <br />
            <br />
            <b>However,</b> Account Linking is less secure, especially if admins
            use this provider to sign in, so we don't recommend enabling it if
            you don't need it.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
