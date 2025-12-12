import { Link } from 'react-router-dom';

export const Services = () => {
  const services = [
    {
      id: '01',
      slug: 'artificial-intelligence',
      title: 'Artificial Intelligence',
      description: 'Automate tasks and boost efficiency with cutting-edge AI integration. We build smart systems that learn and adapt.',
    },
    {
      id: '02',
      slug: 'web-development',
      title: 'Web Development',
      description: 'Building cybersecurity cultures and robust web applications. Custom websites that attract and convert.',
    },
    {
      id: '03',
      slug: 'cloud-solutions',
      title: 'Cloud Solutions',
      description: 'Scalable infrastructure for the future. Secure, reliable, and accessible from anywhere in the world.',
    },
    {
      id: '04',
      slug: 'cyber-security',
      title: 'Cyber Security',
      description: 'Protecting your digital assets with enterprise-grade security protocols. Sleep soundly knowing you\'re safe.',
    },
    {
      id: '05',
      slug: 'data-analytics',
      title: 'Data Analytics',
      description: 'Turn raw data into actionable insights. We help you make decisions based on facts, not guesses.',
    },
    {
      id: '06',
      slug: 'app-development',
      title: 'App Development',
      description: 'Native and cross-platform mobile experiences that users love. From concept to app store.',
    },
  ];

  return (
    <section className="services" id="services">
      <div className="section-header">
        <h2 className="section-title">Our Expertise</h2>
        <p style={{ color: 'var(--text-muted)' }}>Comprehensive IT services tailored for scale.</p>
      </div>

      <div className="grid">
        {services.map((service) => (
          <Link
            key={service.id}
            to={`/services/${service.slug}`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <span className="card-number">{service.id}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
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
