import { Icons } from '../ui/icons';

const CreateChooseCourseAnimation = () => {
  return (
    <div className="pt-8 flex justify-center items-center">
      <Icons.logo
        className="wave-infinite primary-foreground"
        style={{ width: '150px', height: 'auto' }}
      />
      <h3 className="text-3xl tracking-tight">Create/Choose a course!</h3>
    </div>
  );
};

export default CreateChooseCourseAnimation;
