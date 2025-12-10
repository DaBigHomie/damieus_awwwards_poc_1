import { Navigation, Footer } from '../components';

export const Work = () => {
  return (
    <>
      <Navigation />
      <main className="work-page">
        <section className="work-hero">
          <h1>Our Work</h1>
          <p>Portfolio of projects and case studies</p>
        </section>
        {/* Add portfolio grid here */}
      </main>
      <Footer />
    </>
  );
};
