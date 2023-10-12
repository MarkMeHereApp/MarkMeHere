import { Icons } from '../ui/icons';

const Loading = ({ name = 'Loading' }) => {
  return (
    <div className="flex items-center">
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      <span>{name}...</span>
    </div>
  );
};

export default Loading;
