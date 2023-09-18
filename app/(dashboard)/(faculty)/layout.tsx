import MainBar from '@/app/(dashboard)/(faculty)/components/main-bar';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainBar />
      {children}
    </>
  );
}
