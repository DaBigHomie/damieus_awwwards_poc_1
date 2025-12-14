import { Navigation, Footer } from '../components';
import '../styles/agency.css';

export const Agency = () => {
  return (
    <>
      <Navigation />
      <main className="agency-page">
        <section className="hero-section">
          <div className="container">
            <h1>Agency</h1>
            <p>Welcome to the Agency page.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
