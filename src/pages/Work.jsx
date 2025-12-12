import { Navigation, Footer } from '../components';
import { ProjectsGrid } from '../components/ProjectsGrid';
import '../styles/projects.css';

export const Work = () => {
  return (
    <>
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
