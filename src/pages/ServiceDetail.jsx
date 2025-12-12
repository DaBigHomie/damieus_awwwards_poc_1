import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation, Footer } from '../components';
import wordpressServices from '../data/wordpress-services.json';
import '../styles/service-detail.css';

// Convert WordPress services object to array format
const servicesData = Object.values(wordpressServices);

export const ServiceDetail = () => {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    return (
      <>
        <Helmet>
          <title>Service Not Found | Damieus Technology Solutions</title>
          <meta name="description" content="The service you're looking for could not be found." />
        </Helmet>
        <Navigation />
        <main className="service-not-found">
          <div className="container">
            <h1>Service Not Found</h1>
            <p>Sorry, we couldn&apos;t find the service you&apos;re looking for.</p>
            <Link to="/services" className="btn-primary">View All Services</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Generate description from service tagline or overview
  const description = service.tagline || service.overview?.paragraphs?.[0] || `Learn about our ${service.title} services and solutions.`;

  return (
    <>
      <Helmet>
        <title>{service.title} | Damieus Technology Solutions</title>
        <meta name="description" content={description.substring(0, 160)} />
        <meta property="og:title" content={`${service.title} | Damieus`} />
        <meta property="og:description" content={description.substring(0, 160)} />
        <meta property="og:type" content="website" />
        <meta name="keywords" content={`${service.title}, technology solutions, ${slug}, digital services`} />
        <link rel="canonical" href={`https://damieus.com/services/${slug}`} />
      </Helmet>
      <Navigation />
      <main className="service-detail">
        {/* Breadcrumb */}
        <div className="service-breadcrumb">
          <div className="container">
            <Link to="/services">Services</Link>
            <span className="breadcrumb-separator">/</span>
            <span>{service.title}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="service-hero">
          <div className="container">
            <span className="service-number">{service.id}</span>
            <h1>{service.title}</h1>
            <p className="service-tagline">{service.tagline}</p>
          </div>
        </section>

        {/* Overview */}
        <section className="service-overview">
          <div className="container">
            <div className="overview-content">
              {service.overview.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="service-capabilities">
          <div className="container">
            <h2>What We Offer</h2>
            <div className="capabilities-grid">
              {service.capabilities.map((capability, index) => (
                <div key={index} className="capability-card">
                  <span className="capability-icon">{capability.icon}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="service-process">
          <div className="container">
            <h2>Our Process</h2>
            <div className="process-steps">
              {service.process.map((step, index) => (
                <div key={index} className="process-step">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="service-technologies">
          <div className="container">
            <h2>Technologies We Use</h2>
            <div className="tech-tags">
              {service.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="service-benefits">
          <div className="container">
            <h2>Key Benefits</h2>
            <ul className="benefits-list">
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Case Studies */}
        {service.caseStudies && service.caseStudies.length > 0 && (
          <section className="service-case-studies">
            <div className="container">
              <h2>Featured Work</h2>
              <div className="case-studies-grid">
                {service.caseStudies.map((study, index) => (
                  <Link key={index} to={study.link} className="case-study-card">
                    <h3>{study.project}</h3>
                    <p className="case-study-client">{study.client}</p>
                    <p className="case-study-result">{study.result}</p>
                    <span className="case-study-link">
                      View Case Study
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="service-pricing">
          <div className="container">
            <div className="pricing-card">
              <h2>Investment & Timeline</h2>
              <div className="pricing-details">
                <div className="pricing-item">
                  <span className="pricing-label">Starting From</span>
                  <span className="pricing-value">{service.pricing.starting}</span>
                </div>
                <div className="pricing-item">
                  <span className="pricing-label">Typical Timeline</span>
                  <span className="pricing-value">{service.pricing.timeline}</span>
                </div>
              </div>
              <p className="pricing-note">{service.pricing.model}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="service-cta">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Let&apos;s discuss how we can help transform your business</p>
            <Link to="/contact" className="btn-primary">
              Schedule a Consultation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
