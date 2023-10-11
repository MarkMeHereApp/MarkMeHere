import { Icons } from '../ui/icons';

const Loading = () => {
  return (
    <div>
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </div>
  );
};

export default Loading;
