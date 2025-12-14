import { Navigation, Footer } from '../components';
import '../styles/onboarding.css';

export const Onboarding = () => {
  return (
    <>
      <Navigation />
      <main className="onboarding-page">
        <section className="hero-section">
          <div className="container">
            <h1>Onboarding</h1>
            <p>Welcome to the Onboarding page.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
