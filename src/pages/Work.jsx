import { Helmet } from 'react-helmet-async';
import { Navigation, Footer } from '../components';
import { ProjectsGrid } from '../components/ProjectsGrid';
import '../styles/projects.css';

export const Work = () => {
  return (
    <>
      <Helmet>
        <title>Our Work | Portfolio & Case Studies | Damieus Technology</title>
        <meta name="description" content="Explore 986+ successful projects and case studies from Damieus Technology Solutions. See how we've transformed businesses with cutting-edge technology." />
        <meta property="og:title" content="Portfolio | Damieus Technology Solutions" />
        <meta property="og:description" content="986+ finished projects, 896+ happy clients. See our portfolio of successful technology implementations." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="portfolio, case studies, projects, success stories, technology solutions" />
        <link rel="canonical" href="https://damieus.com/work" />
      </Helmet>
      <Navigation />
      <main className="work-page">
        <section className="work-hero">
          <h1>Our Work</h1>
          <p>Portfolio of projects and case studies</p>
        </section>
        <ProjectsGrid />
      </main>
      <Footer />
    </>
  );
};
