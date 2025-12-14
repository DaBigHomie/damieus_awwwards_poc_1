import { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';

// Sample project data - replace with actual data from API/CMS
const projectsData = [
  {
    slug: 'quantum-analytics',
    title: 'Quantum Analytics Platform',
    description: 'AI-powered data visualization dashboard for enterprise analytics',
    image: '/images/projects/quantum-analytics.svg',
    client: 'TechCorp Solutions',
    tags: ['AI/ML', 'Dashboard', 'React'],
    featured: true,
    category: 'web-app',
  },
  {
    slug: 'neon-commerce',
    title: 'Neon Commerce',
    description: 'Next-generation e-commerce platform with AR integration',
    image: '/images/projects/neon-commerce.svg',
    client: 'RetailX',
    tags: ['E-commerce', 'AR', 'Next.js'],
    featured: true,
    category: 'web-app',
  },
  {
    slug: 'cyber-identity',
    title: 'Cyber Identity',
    description: 'Blockchain-based identity verification system',
    image: '/images/projects/cyber-identity.svg',
    client: 'SecureChain',
    tags: ['Blockchain', 'Security', 'Web3'],
    featured: false,
    category: 'web3',
  },
  {
    slug: 'future-mobility',
    title: 'Future Mobility',
    description: 'Electric vehicle charging network management system',
    image: '/images/projects/future-mobility.svg',
    client: 'EV Networks',
    tags: ['IoT', 'Mobile', 'React Native'],
    featured: false,
    category: 'mobile',
  },
  {
    slug: 'neural-creative',
    title: 'Neural Creative Studio',
    description: 'AI-assisted design tool for creative professionals',
    image: '/images/projects/neural-creative.svg',
    client: 'CreativeAI',
    tags: ['AI', 'Design', 'SaaS'],
    featured: false,
    category: 'web-app',
  },
  {
    slug: 'smart-city-hub',
    title: 'Smart City Hub',
    description: 'Urban infrastructure monitoring and management platform',
    image: '/images/projects/smart-city-hub.svg',
    client: 'UrbanTech',
    tags: ['IoT', 'Dashboard', 'Real-time'],
    featured: false,
    category: 'web-app',
  },
];

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'web-app', label: 'Web Apps' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web3', label: 'Web3' },
];

export const ProjectsGrid = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projectsData;
    }
    return projectsData.filter(project => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="projects-section">
      <div className="container">
        {/* Filter Bar */}
        <div className="projects-filter" role="navigation" aria-label="Project filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))
          ) : (
            <div className="no-projects">
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>

        {/* Stats/Info */}
        <div className="projects-stats">
          <p className="stats-text">
            Showing <span className="accent">{filteredProjects.length}</span> of{' '}
            <span className="accent">{projectsData.length}</span> projects
          </p>
        </div>
      </div>
    </section>
  );
};
