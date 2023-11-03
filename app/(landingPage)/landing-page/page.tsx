import LandingPage from '../components/landing-page';
export default async function HomePage() {
  if (process.env.DEMO_MODE) {
    // @ts-ignore
    return <LandingPage />;
  }

  throw new Error(
    'You are not in Demo Mode. The Landing Page is unnavailable to you.'
  );
}
