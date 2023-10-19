import { firaSansFont } from '@/utils/fonts';
import { Icons } from '@/components/ui/icons';

export const NoCourse = () => {
  return (
    <div className="h-1/2 w-1/2 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="p-6 flex justify-center items-center space-y-4 pt-8 animate-in fade-in ease-in duration-1000 ">
        <Icons.logo
          className="wave-infinite primary-foreground"
          style={{ minWidth: '120px', height: 'auto' }}
        />
        <span className={firaSansFont.className}>
          <div className="flex-col">
            <h2 className="text-4xl font-bold">Welcome to Mark Me Here!</h2>
            <h2 className="mt-1 text-2xl font-bold">
              Create a course to get started.
              {`NEXT_PUBLIC_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`}
              {`NEXT_PUBLIC_VERCEL_URL: ${process.env.NEXT_PUBLIC_VERCEL_URL}`}
            </h2>
          </div>
        </span>
      </div>
    </div>
  );
};

export default NoCourse;
