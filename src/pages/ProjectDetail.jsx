import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation, Footer } from '../components';
import { Lightbox } from '../components/Lightbox';
import { RelatedProjects } from '../components/RelatedProjects';
import '../styles/project-detail.css';

// Sample project data - in production, this would come from an API or CMS
const projectsData = [
  {
    slug: 'quantum-analytics',
    title: 'Quantum Analytics Platform',
    client: 'TechCorp Industries',
    year: '2024',
    services: ['UI/UX Design', 'Full-Stack Development', 'AI Integration'],
    liveUrl: 'https://quantum-analytics.example.com',
    hero: '/images/projects/quantum-analytics.jpg',
    description: `Quantum Analytics Platform represents the next generation of business intelligence tools, combining advanced machine learning algorithms with an intuitive user interface. This comprehensive platform enables enterprises to transform complex data sets into actionable insights through real-time analytics, predictive modeling, and automated reporting systems.

The project challenged us to create a solution that could handle massive data volumes while maintaining sub-second query response times. Our team designed a distributed architecture leveraging edge computing and intelligent caching strategies to deliver exceptional performance at scale.`,
    challenge: 'TechCorp needed a platform capable of processing millions of data points in real-time while providing an accessible interface for non-technical users. Legacy systems were slow, complex, and required extensive training.',
    solution: 'We developed a cloud-native architecture with AI-powered insights, natural language queries, and customizable dashboards. The platform features intelligent data visualization that automatically selects the best chart types based on data patterns.',
    results: [
      '87% reduction in data analysis time',
      '3.2M data points processed per second',
      '94% user satisfaction score',
      '40% increase in data-driven decisions'
    ],
    gallery: [
      { url: '/images/projects/quantum-analytics-1.jpg', alt: 'Dashboard overview', caption: 'Main dashboard with real-time analytics' },
      { url: '/images/projects/quantum-analytics-2.jpg', alt: 'Data visualization', caption: 'Advanced data visualization tools' },
      { url: '/images/projects/quantum-analytics-3.jpg', alt: 'Mobile view', caption: 'Responsive mobile interface' },
      { url: '/images/projects/quantum-analytics-4.jpg', alt: 'AI insights', caption: 'AI-powered predictive insights' }
    ],
    tags: ['AI/ML', 'Dashboard', 'React'],
    category: 'web-app',
    featured: true
  },
  {
    slug: 'neon-commerce',
    title: 'Neon Commerce',
    client: 'RetailX Global',
    year: '2024',
    services: ['E-commerce Platform', 'AR Integration', 'Mobile Development'],
    liveUrl: 'https://neon-commerce.example.com',
    hero: '/images/projects/neon-commerce.jpg',
    description: `Neon Commerce revolutionizes online shopping with augmented reality features that allow customers to visualize products in their space before purchase. This next-generation e-commerce platform combines cutting-edge AR technology with seamless checkout experiences and personalized recommendations powered by machine learning.

Built on a modern headless architecture, the platform delivers lightning-fast performance across all devices while providing retailers with powerful tools for inventory management, analytics, and customer engagement.`,
    challenge: 'RetailX needed to differentiate their e-commerce platform in a crowded market while addressing high cart abandonment rates and product return issues caused by mismatched customer expectations.',
    solution: 'We implemented WebAR technology requiring no app downloads, AI-driven size recommendations, and a streamlined one-click checkout process. The platform includes real-time inventory sync across multiple channels and automated personalization.',
    results: [
      '64% reduction in cart abandonment',
      '41% decrease in product returns',
      '2.8x increase in conversion rate',
      '91% positive AR feature feedback'
    ],
    gallery: [
      { url: '/images/projects/neon-commerce-1.jpg', alt: 'Product catalog', caption: 'Modern product catalog with AR preview' },
      { url: '/images/projects/neon-commerce-2.jpg', alt: 'AR feature', caption: 'Augmented reality product visualization' },
      { url: '/images/projects/neon-commerce-3.jpg', alt: 'Checkout flow', caption: 'Streamlined checkout experience' },
      { url: '/images/projects/neon-commerce-4.jpg', alt: 'Mobile shopping', caption: 'Mobile-optimized shopping experience' }
    ],
    tags: ['E-commerce', 'AR', 'Next.js'],
    category: 'web-app',
    featured: true
  },
  {
    slug: 'cyber-identity',
    title: 'Cyber Identity',
    client: 'SecureChain Networks',
    year: '2024',
    services: ['Blockchain Development', 'Security Architecture', 'Web3 Integration'],
    liveUrl: 'https://cyber-identity.example.com',
    hero: '/images/projects/cyber-identity.jpg',
    description: `Cyber Identity is a decentralized identity management system built on blockchain technology, providing users with complete control over their digital identities. The platform enables secure, privacy-preserving authentication across multiple services without relying on centralized authorities.

This innovative solution addresses growing concerns about data privacy and identity theft by leveraging zero-knowledge proofs and distributed ledger technology to create a trustless verification system.`,
    challenge: 'Traditional identity systems are vulnerable to data breaches and require users to trust centralized entities with sensitive personal information. SecureChain needed a solution that gave users full control while maintaining security.',
    solution: 'We built a Web3 identity platform using Ethereum smart contracts and IPFS for decentralized storage. The system uses zero-knowledge proofs for privacy-preserving verification and includes a user-friendly wallet interface.',
    results: [
      'Zero data breaches since launch',
      '150K+ verified digital identities',
      '99.99% uptime across nodes',
      'Integration with 50+ dApps'
    ],
    gallery: [
      { url: '/images/projects/cyber-identity-1.jpg', alt: 'Identity dashboard', caption: 'User identity management dashboard' },
      { url: '/images/projects/cyber-identity-2.jpg', alt: 'Verification flow', caption: 'Secure verification process' },
      { url: '/images/projects/cyber-identity-3.jpg', alt: 'Wallet interface', caption: 'Digital wallet interface' }
    ],
    tags: ['Blockchain', 'Security', 'Web3'],
    category: 'web3',
    featured: false
  },
  {
    slug: 'future-mobility',
    title: 'Future Mobility',
    client: 'EV Networks',
    year: '2023',
    services: ['IoT Development', 'Mobile Apps', 'Real-time Systems'],
    liveUrl: 'https://future-mobility.example.com',
    hero: '/images/projects/future-mobility.jpg',
    description: `Future Mobility is a comprehensive electric vehicle charging network management system that connects drivers, charging stations, and grid operators in a seamless ecosystem. The platform optimizes charging schedules based on grid demand, energy prices, and user preferences while providing real-time availability and navigation.

Built with IoT integration at its core, the system manages thousands of charging points across urban and highway networks, ensuring reliable service and efficient energy distribution.`,
    challenge: 'EV adoption was hindered by charging anxiety - uncertainty about finding available stations and long wait times. The client needed a solution to optimize the charging network and improve user experience.',
    solution: 'We developed cross-platform mobile apps with real-time station availability, smart routing, and reservation systems. The IoT backend coordinates with grid operators for load balancing and includes predictive maintenance for charging stations.',
    results: [
      '76% reduction in charging wait times',
      '2,500+ connected charging stations',
      '320K+ active monthly users',
      '28% improvement in grid efficiency'
    ],
    gallery: [
      { url: '/images/projects/future-mobility-1.jpg', alt: 'Mobile app', caption: 'Mobile app with station finder' },
      { url: '/images/projects/future-mobility-2.jpg', alt: 'Station map', caption: 'Real-time charging network map' },
      { url: '/images/projects/future-mobility-3.jpg', alt: 'Charging status', caption: 'Live charging status monitoring' }
    ],
    tags: ['IoT', 'Mobile', 'React Native'],
    category: 'mobile',
    featured: false
  },
  {
    slug: 'neural-creative',
    title: 'Neural Creative Studio',
    client: 'CreativeAI Labs',
    year: '2024',
    services: ['AI Development', 'Design Tools', 'SaaS Platform'],
    liveUrl: 'https://neural-creative.example.com',
    hero: '/images/projects/neural-creative.jpg',
    description: `Neural Creative Studio is an AI-powered design platform that assists creative professionals in generating, iterating, and refining visual content. The platform combines generative AI models with intuitive design tools, enabling users to transform ideas into polished designs through natural language prompts and intelligent suggestions.

The system learns from user preferences and industry trends to provide increasingly personalized recommendations while maintaining full creative control in the hands of the designer.`,
    challenge: 'Creative professionals needed AI tools that enhanced rather than replaced their creativity. Existing solutions were either too complex or produced generic, unusable outputs that required extensive manual refinement.',
    solution: 'We created an intelligent design assistant that understands context and brand guidelines. The platform features real-time collaboration, version control, and a unique "creativity dial" that lets users control the balance between AI automation and manual control.',
    results: [
      '4.5x faster design iterations',
      '89% designer satisfaction rate',
      '50K+ designs generated monthly',
      'Integration with major design tools'
    ],
    gallery: [
      { url: '/images/projects/neural-creative-1.jpg', alt: 'Design interface', caption: 'AI-assisted design interface' },
      { url: '/images/projects/neural-creative-2.jpg', alt: 'AI suggestions', caption: 'Real-time design suggestions' },
      { url: '/images/projects/neural-creative-3.jpg', alt: 'Collaboration', caption: 'Team collaboration features' }
    ],
    tags: ['AI', 'Design', 'SaaS'],
    category: 'web-app',
    featured: false
  },
  {
    slug: 'smart-city-hub',
    title: 'Smart City Hub',
    client: 'UrbanTech Solutions',
    year: '2023',
    services: ['IoT Platform', 'Data Analytics', 'City Management'],
    liveUrl: 'https://smart-city-hub.example.com',
    hero: '/images/projects/smart-city-hub.jpg',
    description: `Smart City Hub is an integrated urban management platform that connects various city systems - from traffic lights and public transit to waste management and energy grids. The platform provides city officials with real-time insights and automated control systems to improve efficiency, reduce costs, and enhance quality of life for citizens.

By aggregating data from thousands of IoT sensors and devices, the system creates a comprehensive digital twin of the city, enabling predictive maintenance, resource optimization, and emergency response coordination.`,
    challenge: 'City systems operated in silos with no unified data or control. Officials needed a centralized platform to monitor and manage diverse urban infrastructure while identifying optimization opportunities.',
    solution: 'We built a scalable IoT platform with real-time data ingestion from 10,000+ sensors. The system includes AI-powered traffic optimization, predictive maintenance algorithms, and a citizen-facing mobile app for reporting issues and accessing city services.',
    results: [
      '33% reduction in traffic congestion',
      '22% energy cost savings',
      '45% faster emergency response',
      '85% citizen satisfaction increase'
    ],
    gallery: [
      { url: '/images/projects/smart-city-hub-1.jpg', alt: 'City dashboard', caption: 'Comprehensive city management dashboard' },
      { url: '/images/projects/smart-city-hub-2.jpg', alt: 'Traffic control', caption: 'Real-time traffic optimization' },
      { url: '/images/projects/smart-city-hub-3.jpg', alt: 'Analytics', caption: 'Predictive analytics and insights' }
    ],
    tags: ['IoT', 'Dashboard', 'Real-time'],
    category: 'web-app',
    featured: false
  }
];

export const ProjectDetail = () => {
  const { slug } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const project = projectsData.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <>
        <Navigation />
        <main className="project-not-found">
          <div className="container">
            <h1>Project Not Found</h1>
            <p>Sorry, we couldn&apos;t find the project you&apos;re looking for.</p>
            <Link to="/work" className="btn-primary">Back to Projects</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Navigation />
      <main className="project-detail">
        {/* Breadcrumb */}
        <div className="project-breadcrumb">
          <div className="container">
            <Link to="/work">Work</Link>
            <span className="breadcrumb-separator">/</span>
            <span>{project.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="project-hero">
          <div className="project-hero-image">
            <img src={project.hero} alt={project.title} />
          </div>
        </section>

        {/* Project Info */}
        <section className="project-info">
          <div className="container">
            <div className="project-header">
              <div className="project-title-section">
                <h1>{project.title}</h1>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="project-meta">
                <div className="meta-item">
                  <span className="meta-label">Client</span>
                  <span className="meta-value">{project.client}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Year</span>
                  <span className="meta-value">{project.year}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Services</span>
                  <span className="meta-value">{project.services.join(', ')}</span>
                </div>
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View Live Site
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="project-description">
              {project.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge, Solution, Results */}
        <section className="project-details">
          <div className="container">
            <div className="detail-grid">
              <div className="detail-card">
                <h2>The Challenge</h2>
                <p>{project.challenge}</p>
              </div>
              <div className="detail-card">
                <h2>Our Solution</h2>
                <p>{project.solution}</p>
              </div>
              <div className="detail-card detail-results">
                <h2>Results</h2>
                <ul className="results-list">
                  {project.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="project-gallery">
          <div className="container">
            <h2>Project Gallery</h2>
            <div className="gallery-grid">
              {project.gallery.map((image, index) => (
                <button
                  key={index}
                  className="gallery-item"
                  onClick={() => openLightbox(index)}
                  aria-label={`View ${image.alt} in lightbox`}
                >
                  <img src={image.url} alt={image.alt} loading="lazy" />
                  <div className="gallery-overlay">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M14 22L22 14M22 14H14M22 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Related Projects */}
        <RelatedProjects projects={projectsData} currentProjectSlug={slug} />

        {/* CTA Section */}
        <section className="project-cta">
          <div className="container">
            <h2>Ready to Start Your Project?</h2>
            <p>Let&apos;s create something amazing together</p>
            <Link to="/contact" className="btn-primary">
              Get in Touch
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {lightboxOpen && (
        <Lightbox 
          images={project.gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};
