import { useState } from 'react';
import PropTypes from 'prop-types';

export const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article 
      className="project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-image-wrapper">
        <img 
          src={project.image} 
          alt={project.title}
          className={`project-image ${isHovered ? 'hovered' : ''}`}
          loading="lazy"
        />
        {project.featured && (
          <span className="project-badge">Featured</span>
        )}
      </div>
      
      <div className="project-content">
        <div className="project-tags">
          {project.tags?.map((tag, index) => (
            <span key={index} className="project-tag">{tag}</span>
          ))}
        </div>
        
        <h3 className="project-title">{project.title}</h3>
        
        {project.description && (
          <p className="project-description">{project.description}</p>
        )}
        
        {project.client && (
          <p className="project-client">Client: {project.client}</p>
        )}
        
        <a 
          href={`/work/${project.slug}`} 
          className="project-link"
          aria-label={`View ${project.title} project details`}
        >
          View Project
          <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string.isRequired,
    client: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    featured: PropTypes.bool,
  }).isRequired,
};
