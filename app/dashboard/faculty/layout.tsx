import CourseSwitcher from '@/app/dashboard/components/main-bar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CourseSwitcher />
      {children}
    </>
  );
}
