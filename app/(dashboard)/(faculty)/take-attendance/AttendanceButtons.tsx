import { Button } from '@/components/ui/button';

interface AttendanceButtonsProps {
  status: string;
  onClick: () => Promise<void>;
}

const AttendanceButtons = ({ status, onClick }: AttendanceButtonsProps) => {
  return (
    <Button variant="outline" size="sm" className="h-8" onClick={onClick}>
      {status}
    </Button>
  );
};

export default AttendanceButtons;
