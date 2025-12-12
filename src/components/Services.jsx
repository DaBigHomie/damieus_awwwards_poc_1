import { Link } from 'react-router-dom';
import wordpressServices from '../data/wordpress-services.json';

export const Services = () => {
  // Convert WordPress services object to array and take first 12 for display
  const services = Object.values(wordpressServices).slice(0, 12);

  return (
    <section className="services" id="services">
      <div className="section-header">
        <h2 className="section-title">Our Expertise</h2>
        <p style={{ color: 'var(--text-muted)' }}>Comprehensive IT services tailored for scale.</p>
      </div>

      <div className="grid">
        {services.map((service) => (
          <Link
            key={service.number}
            to={`/services/${service.slug}`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <span className="card-number">{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.tagline}</p>
            <span className="card-link">
              Learn More
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
