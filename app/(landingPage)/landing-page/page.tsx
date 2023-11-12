import LandingPage from '../components/landing-page';
export default async function HomePage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE) {
    return <LandingPage />;
  }

  throw new Error(
    'You are not in Demo Mode. The Landing Page is unnavailable to you.'
  );
}
