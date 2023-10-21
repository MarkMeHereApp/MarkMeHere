import { ArrowRight } from 'lucide-react';

const Continue = ({ name = 'Continue' }) => {
  return (
    <div className="flex items-center">
      <span>{name}</span>
      <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-in-out transform translate-x-1 group-hover:translate-x-2 ml-2" />
    </div>
  );
};

export default Continue;
