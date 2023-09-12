import { Icons } from '../ui/icons';
import { firaSansFont } from '@/utils/fonts';

const MarkMeHereClassAnimation = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-0">
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '20%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '40%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '60%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '100%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '60%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '40%', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '20%', height: 'auto' }}
        />
      </div>
      <span className={firaSansFont.className}>
        <h2 className="text-3xl font-bold">Mark Me Here!</h2>
      </span>
    </div>
  );
};

export default MarkMeHereClassAnimation;
