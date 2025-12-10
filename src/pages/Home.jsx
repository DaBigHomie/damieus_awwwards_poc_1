import React from 'react';
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
