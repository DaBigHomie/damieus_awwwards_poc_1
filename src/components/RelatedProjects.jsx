import { Link } from 'react-router-dom';

export const RelatedProjects = ({ projects, currentProjectSlug }) => {
  // Filter out current project and limit to 3
  const relatedProjects = projects
    .filter(p => p.slug !== currentProjectSlug)
    .slice(0, 3);

  if (relatedProjects.length === 0) return null;

  return (
    <section className="related-projects">
      <div className="container">
        <h2>Related Projects</h2>
        <div className="related-projects-grid">
          {relatedProjects.map((project) => (
            <Link 
              key={project.slug}
              to={`/work/${project.slug}`}
              className="related-project-card"
              aria-label={`View ${project.title} project details`}
            >
              <div className="related-project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                  loading="lazy"
                />
              </div>
              <div className="related-project-content">
                <h3>{project.title}</h3>
                <p>{project.client}</p>
                <div className="related-project-tags">
                  {project.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
