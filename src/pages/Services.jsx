import { Helmet } from 'react-helmet-async';
import { Navigation, Footer, Services as ServicesSection } from '../components';

export const Services = () => {
  return (
    <>
      <Helmet>
        <title>Our Services | AI, Cloud, Web Development & More | Damieus</title>
        <meta name="description" content="Explore our comprehensive technology services: Artificial Intelligence, Cloud Solutions, Web Development, Cybersecurity, Data Analytics, Mobile Apps, and more." />
        <meta property="og:title" content="Technology Services | Damieus Solutions" />
        <meta property="og:description" content="Premium digital services including AI, cloud computing, web development, and cybersecurity solutions." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="technology services, AI solutions, cloud services, web development, cybersecurity, data analytics, mobile apps" />
        <link rel="canonical" href="https://damieus.com/services" />
      </Helmet>
      <Navigation />
      <main className="services-page">
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
};
