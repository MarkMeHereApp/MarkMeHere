import { ensureAndGetNextAuthSession } from '@/data/auth';
import FirstCourseCreation from './components/first-course-creation';
import { zSiteRoles } from '@/types/sharedZodTypes';

export default async function Page() {
  const session = await ensureAndGetNextAuthSession();

  if (session.user.role !== zSiteRoles.enum.admin) {
    throw new Error('You do not have permission to access this page');
  }
  return <FirstCourseCreation />;
}
