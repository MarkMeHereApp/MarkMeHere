import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

export const ContinueButton = ({
  name = 'Continue',
  type,
  onClick
}: {
  name?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}) => {
  return (
    <Button
      variant={'outline'}
      type={type}
      className="transition-all duration-500 ease-in-out group"
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>{name}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-in-out transform translate-x-1 group-hover:translate-x-2 ml-2" />
      </div>
    </Button>
  );
};
