import { Navigation, Footer, About as AboutSection } from '../components';

export const About = () => {
  return (
    <>
      <Navigation />
      <main className="about-page">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
};
