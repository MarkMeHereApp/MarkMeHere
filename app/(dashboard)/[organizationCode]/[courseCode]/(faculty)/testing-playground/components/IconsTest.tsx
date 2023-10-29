import { Icons } from '@/components/ui/icons';
import Loading from '@/components/general/loading';
import { Button } from '@/components/ui/button';

const IconsTest = () => {
  return (
    <div>
      asdasd
      <Icons.logo
        className="wave primary-foreground"
        style={{ height: '100px', width: '100px' }}
      />
      <Button>
        <Loading />
      </Button>
    </div>
  );
};

export default IconsTest;
