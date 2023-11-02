'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export function TermsOfServiceDialog({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[550px]">
        <ScrollArea className="w-full rounded-md max-h-[90vh] ">
          <DialogHeader>
            <DialogTitle>Terms Of Service</DialogTitle>
            <DialogDescription>
              By using this self-hosting attendance app, you agree to the
              following terms:
              <ul>
                <li>
                  - You are solely responsible for any issues that may arise
                  from the use of this app.
                </li>
                <li>
                  - We are not liable for any damages or losses related to your
                  use of the app.
                </li>
                <li>
                  - We do not guarantee that the app will function without
                  disruptions or errors.
                </li>
                <li>
                  - Any actions you take based on the information provided by
                  the app are your sole responsibility.
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
