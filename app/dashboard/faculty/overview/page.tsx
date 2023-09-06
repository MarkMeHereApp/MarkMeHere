import TestingPage from '../testing-playground/page';

export default async function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:w-1/2 p-8 md:p-12">
        <TestingPage />
      </div>
    </div>
  );
}
