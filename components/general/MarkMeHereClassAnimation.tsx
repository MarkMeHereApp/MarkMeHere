import { Icons } from '../ui/icons';

const MarkMeHereClassAnimation = () => {
  return (
    <div className="pt-8 flex flex-col items-center justify-center">
      <div className="flex space-x-0 items-center">
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '25px', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '50px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '100px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '150px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '100px', height: 'auto' }}
        />

        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '50px', height: 'auto' }}
        />
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ width: '25px', height: 'auto' }}
        />
      </div>
      <h2 className="text-3xl italic font-bold tracking-tight">
        "Mark Me Here!"
      </h2>
    </div>
  );
};

export default MarkMeHereClassAnimation;
