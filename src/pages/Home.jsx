import { Helmet } from 'react-helmet-async';
import {
  Loader,
  CustomCursor,
  Navigation,
  Hero,
  Marquee,
  Services,
  About,
  Footer,
} from '../components';

export const Home = () => {
  return (
    <>
      <Helmet>
        <title>Damieus Technology Solutions | Premium Digital Services & AI Solutions</title>
        <meta name="description" content="Leading technology solutions provider offering AI, cloud services, web development, cybersecurity, and data analytics. Transform your digital presence with 25+ years of expertise." />
        <meta property="og:title" content="Damieus Technology Solutions" />
        <meta property="og:description" content="Premium digital services, AI solutions, and technology consulting." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="technology solutions, AI services, cloud computing, web development, cybersecurity, data analytics" />
        <link rel="canonical" href="https://damieus.com/" />
      </Helmet>
      <Loader />
      <CustomCursor />
      <Navigation />
      <Hero />
      <Marquee />
      <Services />
      <About />
      <Footer />
    </>
  );
};
