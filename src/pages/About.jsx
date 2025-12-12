import { Helmet } from 'react-helmet-async';
import { Navigation, Footer, About as AboutSection } from '../components';

export const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Damieus Technology Solutions - 25+ Years of Excellence</title>
        <meta name="description" content="Learn about Damieus Technology Solutions. With 986+ projects, 896+ clients, and 396+ experts, we've been delivering premium technology solutions for over 25 years." />
        <meta property="og:title" content="About Damieus | Leading Technology Solutions Provider" />
        <meta property="og:description" content="25+ years of excellence, 986+ projects completed, 896+ happy clients worldwide." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://damieus.com/about" />
      </Helmet>
      <Navigation />
      <main className="about-page">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
};
