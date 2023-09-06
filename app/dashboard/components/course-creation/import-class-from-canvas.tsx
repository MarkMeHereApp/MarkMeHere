import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { CanvasCourseSelector } from './canvas-course-selector';

export function ImportClassFromCanvas() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Icons.canvas className="text-xs text-destructive" />
          <span className="ml-2">Canvas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Canvas Course</DialogTitle>
          <DialogDescription>
            Choose which Canvas course you want to import.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <CanvasCourseSelector />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
