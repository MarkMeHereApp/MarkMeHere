import { Button } from '../ui/button';

export const SkeletonButtonText = ({ className }: { className?: string }) => {
  return (
    <Button variant={'skeleton'} className={className} disabled={true}>
      {'\u200B'}
    </Button>
  );
};
