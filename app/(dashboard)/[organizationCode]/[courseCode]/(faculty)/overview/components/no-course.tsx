import { firaSansFont } from '@/utils/fonts';

export const NoCourse = () => {
  return (
    <div className="h-1/2 w-3/4 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="p-6 flex justify-center items-center pt-8 animate-in fade-in ease-in duration-1000">
        <span className={firaSansFont.className}>
            <h2 className="text-4xl font-bold">Welcome to Mark Me Here!</h2>
            <h2 className="text-2xl font-bold mt-1">
                Create a course to get started.
            </h2>
        </span>
      </div>
    </div>
  );
};

export default NoCourse;
