import { Navigation, Footer, Services as ServicesSection } from '../components';

export const Services = () => {
  return (
    <>
      <Navigation />
      <main className="services-page">
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
};
