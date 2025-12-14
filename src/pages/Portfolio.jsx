import { Navigation, Footer } from '../components';
import '../styles/portfolio.css';

export const Portfolio = () => {
  return (
    <>
      <Navigation />
      <main className="portfolio-page">
        <section className="hero-section">
          <div className="container">
            <h1>Portfolio</h1>
            <p>Welcome to the Portfolio page.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
