import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation, Footer } from '../components';
import '../styles/service-detail.css';

// Comprehensive services data
const servicesData = [
  {
    slug: 'artificial-intelligence',
    id: '01',
    title: 'Artificial Intelligence',
    tagline: 'Intelligent systems that learn, adapt, and transform your business',
    hero: '/images/services/ai-hero.jpg',
    overview: `Our Artificial Intelligence solutions harness the power of machine learning, natural language processing, and computer vision to automate complex tasks, uncover hidden insights, and create intelligent systems that evolve with your business needs.

We don't just implement AI—we architect intelligent ecosystems that seamlessly integrate with your existing infrastructure while paving the way for future innovations. Our team of AI specialists brings deep expertise in neural networks, deep learning, and predictive analytics to deliver solutions that provide measurable business value.`,
    
    capabilities: [
      {
        title: 'Machine Learning Models',
        description: 'Custom ML models trained on your data for predictive analytics, classification, and recommendation systems',
        icon: '🤖'
      },
      {
        title: 'Natural Language Processing',
        description: 'Advanced NLP solutions for sentiment analysis, chatbots, document processing, and language translation',
        icon: '💬'
      },
      {
        title: 'Computer Vision',
        description: 'Image recognition, object detection, facial recognition, and video analytics for automated visual intelligence',
        icon: '👁️'
      },
      {
        title: 'Predictive Analytics',
        description: 'Forecast trends, identify patterns, and make data-driven predictions to stay ahead of market changes',
        icon: '📊'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Discovery & Analysis',
        description: 'We analyze your business challenges, data landscape, and objectives to identify high-impact AI opportunities'
      },
      {
        step: '2',
        title: 'Data Preparation',
        description: 'Clean, label, and structure your data to ensure optimal model training and accuracy'
      },
      {
        step: '3',
        title: 'Model Development',
        description: 'Design and train custom AI models using state-of-the-art algorithms and frameworks'
      },
      {
        step: '4',
        title: 'Integration & Deployment',
        description: 'Deploy AI solutions into your production environment with monitoring and continuous improvement'
      }
    ],

    technologies: ['TensorFlow', 'PyTorch', 'scikit-learn', 'Hugging Face', 'OpenAI GPT', 'LangChain', 'AWS SageMaker', 'Azure ML'],

    benefits: [
      'Automate repetitive tasks and free up human resources',
      'Make faster, data-driven decisions with predictive insights',
      'Enhance customer experiences with personalization at scale',
      'Reduce operational costs through intelligent automation',
      'Gain competitive advantage with cutting-edge AI capabilities'
    ],

    caseStudies: [
      {
        client: 'TechCorp Industries',
        project: 'Quantum Analytics Platform',
        result: '87% reduction in data analysis time',
        link: '/work/quantum-analytics'
      },
      {
        client: 'CreativeAI Labs',
        project: 'Neural Creative Studio',
        result: '4.5x faster design iterations',
        link: '/work/neural-creative'
      }
    ],

    pricing: {
      starting: '$25,000',
      timeline: '3-6 months',
      model: 'Custom pricing based on scope and complexity'
    }
  },
  {
    slug: 'web-development',
    id: '02',
    title: 'Web Development',
    tagline: 'High-performance web applications that scale with your ambitions',
    hero: '/images/services/web-dev-hero.jpg',
    overview: `We craft exceptional web experiences that combine stunning design with rock-solid engineering. Our full-stack development team builds custom web applications that are fast, secure, scalable, and optimized for conversions.

From single-page applications to complex enterprise systems, we leverage modern frameworks and best practices to deliver web solutions that exceed expectations. Every line of code is written with performance, security, and maintainability in mind.`,
    
    capabilities: [
      {
        title: 'Frontend Development',
        description: 'Modern, responsive interfaces using React, Vue, Next.js with pixel-perfect implementation',
        icon: '🎨'
      },
      {
        title: 'Backend Architecture',
        description: 'Scalable server-side solutions with Node.js, Python, and cloud-native architectures',
        icon: '⚙️'
      },
      {
        title: 'E-commerce Solutions',
        description: 'Full-featured online stores with payment processing, inventory management, and analytics',
        icon: '🛒'
      },
      {
        title: 'Progressive Web Apps',
        description: 'App-like experiences that work offline, install on devices, and deliver native performance',
        icon: '📱'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Strategy & Planning',
        description: 'Define goals, user personas, sitemap, and technical requirements'
      },
      {
        step: '2',
        title: 'Design & Prototyping',
        description: 'Create wireframes, mockups, and interactive prototypes for validation'
      },
      {
        step: '3',
        title: 'Development & Testing',
        description: 'Build features iteratively with continuous testing and quality assurance'
      },
      {
        step: '4',
        title: 'Launch & Optimization',
        description: 'Deploy to production with monitoring, analytics, and ongoing improvements'
      }
    ],

    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Vercel', 'AWS'],

    benefits: [
      'Lightning-fast load times with optimized code',
      'SEO-friendly architecture for better search rankings',
      'Responsive design that works on all devices',
      'Secure by default with industry best practices',
      'Scalable infrastructure that grows with your business'
    ],

    caseStudies: [
      {
        client: 'RetailX Global',
        project: 'Neon Commerce',
        result: '64% reduction in cart abandonment',
        link: '/work/neon-commerce'
      }
    ],

    pricing: {
      starting: '$15,000',
      timeline: '2-4 months',
      model: 'Fixed price or hourly based on project scope'
    }
  },
  {
    slug: 'cloud-solutions',
    id: '03',
    title: 'Cloud Solutions',
    tagline: 'Scalable, secure cloud infrastructure for the modern enterprise',
    hero: '/images/services/cloud-hero.jpg',
    overview: `Transform your IT infrastructure with cloud solutions designed for reliability, scalability, and cost-efficiency. We architect cloud-native systems that leverage the full power of AWS, Azure, and Google Cloud to deliver exceptional performance and flexibility.

Our cloud experts design multi-region architectures, implement auto-scaling, and ensure 99.99% uptime with comprehensive disaster recovery strategies. Whether migrating legacy systems or building new cloud-native applications, we make the cloud work for you.`,
    
    capabilities: [
      {
        title: 'Cloud Migration',
        description: 'Seamless migration of legacy systems to cloud with zero downtime and data integrity',
        icon: '☁️'
      },
      {
        title: 'Infrastructure as Code',
        description: 'Automated infrastructure provisioning using Terraform, CloudFormation, and Kubernetes',
        icon: '📝'
      },
      {
        title: 'Serverless Architecture',
        description: 'Cost-effective, auto-scaling solutions using AWS Lambda, Azure Functions, and event-driven design',
        icon: '⚡'
      },
      {
        title: 'DevOps & CI/CD',
        description: 'Automated deployment pipelines with continuous integration, testing, and monitoring',
        icon: '🔄'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Cloud Assessment',
        description: 'Evaluate current infrastructure, identify optimization opportunities, and define migration strategy'
      },
      {
        step: '2',
        title: 'Architecture Design',
        description: 'Design scalable, fault-tolerant cloud architecture with security and compliance built-in'
      },
      {
        step: '3',
        title: 'Migration & Implementation',
        description: 'Execute phased migration with testing, validation, and rollback procedures'
      },
      {
        step: '4',
        title: 'Optimization & Management',
        description: 'Monitor performance, optimize costs, and manage infrastructure with 24/7 support'
      }
    ],

    technologies: ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Prometheus'],

    benefits: [
      'Reduce infrastructure costs by up to 40%',
      'Scale resources automatically based on demand',
      'Improve reliability with 99.99% uptime SLA',
      'Deploy faster with automated CI/CD pipelines',
      'Global reach with multi-region deployments'
    ],

    caseStudies: [
      {
        client: 'UrbanTech Solutions',
        project: 'Smart City Hub',
        result: '22% energy cost savings',
        link: '/work/smart-city-hub'
      }
    ],

    pricing: {
      starting: '$20,000',
      timeline: '3-5 months',
      model: 'Migration cost + managed services retainer'
    }
  },
  {
    slug: 'cyber-security',
    id: '04',
    title: 'Cyber Security',
    tagline: 'Enterprise-grade protection for your digital assets and data',
    hero: '/images/services/security-hero.jpg',
    overview: `In an era of sophisticated cyber threats, we provide comprehensive security solutions that protect your business from data breaches, ransomware, and unauthorized access. Our security specialists implement defense-in-depth strategies to safeguard your most valuable assets.

From penetration testing to security audits, incident response to compliance management, we deliver holistic security solutions that evolve with the threat landscape. We don't just react to threats—we anticipate and prevent them.`,
    
    capabilities: [
      {
        title: 'Security Audits',
        description: 'Comprehensive assessments of your security posture with detailed recommendations',
        icon: '🔍'
      },
      {
        title: 'Penetration Testing',
        description: 'Ethical hacking to identify vulnerabilities before malicious actors do',
        icon: '🎯'
      },
      {
        title: 'Identity & Access Management',
        description: 'Zero-trust security with multi-factor authentication and role-based access control',
        icon: '🔐'
      },
      {
        title: 'Security Monitoring',
        description: '24/7 threat detection with SIEM, intrusion prevention, and incident response',
        icon: '👀'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Risk Assessment',
        description: 'Identify vulnerabilities, assess threat vectors, and prioritize security risks'
      },
      {
        step: '2',
        title: 'Security Implementation',
        description: 'Deploy security controls, firewalls, encryption, and access management systems'
      },
      {
        step: '3',
        title: 'Testing & Validation',
        description: 'Conduct penetration tests, vulnerability scans, and security audits'
      },
      {
        step: '4',
        title: 'Monitoring & Response',
        description: 'Continuous monitoring with rapid incident response and threat intelligence'
      }
    ],

    technologies: ['CrowdStrike', 'Splunk', 'Palo Alto', 'Okta', 'AWS Security', 'Azure Security Center', 'OWASP', 'Burp Suite'],

    benefits: [
      'Prevent costly data breaches and ransomware attacks',
      'Meet compliance requirements (SOC 2, ISO 27001, GDPR)',
      'Protect customer trust and brand reputation',
      'Reduce security incidents by up to 90%',
      'Gain visibility into all security events'
    ],

    caseStudies: [
      {
        client: 'SecureChain Networks',
        project: 'Cyber Identity',
        result: 'Zero data breaches since launch',
        link: '/work/cyber-identity'
      }
    ],

    pricing: {
      starting: '$30,000',
      timeline: 'Ongoing',
      model: 'Annual security retainer + incident response'
    }
  },
  {
    slug: 'data-analytics',
    id: '05',
    title: 'Data Analytics',
    tagline: 'Transform raw data into strategic insights that drive growth',
    hero: '/images/services/analytics-hero.jpg',
    overview: `Unlock the power of your data with advanced analytics solutions that turn information into action. We build comprehensive analytics platforms that collect, process, and visualize data from multiple sources, providing real-time insights that drive smarter business decisions.

Our data engineers and analysts work with you to design custom dashboards, implement predictive models, and create automated reporting systems that keep you informed and ahead of the competition.`,
    
    capabilities: [
      {
        title: 'Business Intelligence',
        description: 'Interactive dashboards and reports that provide at-a-glance insights into KPIs',
        icon: '📈'
      },
      {
        title: 'Data Warehousing',
        description: 'Centralized data storage with ETL pipelines for unified analytics',
        icon: '🗄️'
      },
      {
        title: 'Predictive Modeling',
        description: 'Machine learning models that forecast trends and identify opportunities',
        icon: '🔮'
      },
      {
        title: 'Real-time Analytics',
        description: 'Stream processing for instant insights into user behavior and operations',
        icon: '⚡'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Data Discovery',
        description: 'Identify data sources, assess quality, and define key metrics'
      },
      {
        step: '2',
        title: 'Data Infrastructure',
        description: 'Build pipelines, warehouses, and processing systems for unified data'
      },
      {
        step: '3',
        title: 'Analytics Development',
        description: 'Create dashboards, reports, and predictive models tailored to your needs'
      },
      {
        step: '4',
        title: 'Insights & Optimization',
        description: 'Deliver actionable insights with continuous model improvement'
      }
    ],

    technologies: ['Tableau', 'Power BI', 'Snowflake', 'Databricks', 'Apache Spark', 'dbt', 'Airflow', 'Looker'],

    benefits: [
      'Make data-driven decisions with confidence',
      'Identify trends before your competitors',
      'Optimize operations and reduce waste',
      'Personalize customer experiences at scale',
      'Measure ROI on every initiative'
    ],

    caseStudies: [
      {
        client: 'TechCorp Industries',
        project: 'Quantum Analytics Platform',
        result: '94% user satisfaction score',
        link: '/work/quantum-analytics'
      }
    ],

    pricing: {
      starting: '$18,000',
      timeline: '2-4 months',
      model: 'Platform setup + monthly analytics support'
    }
  },
  {
    slug: 'app-development',
    id: '06',
    title: 'App Development',
    tagline: 'Native and cross-platform mobile experiences users love',
    hero: '/images/services/mobile-hero.jpg',
    overview: `Create mobile experiences that captivate users and drive engagement. Our mobile development team builds high-performance native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter that work seamlessly across devices.

From consumer apps to enterprise mobile solutions, we design intuitive interfaces and robust backends that deliver exceptional user experiences. Every app we build is optimized for performance, security, and offline functionality.`,
    
    capabilities: [
      {
        title: 'iOS Development',
        description: 'Native Swift/SwiftUI apps optimized for iPhone and iPad with Apple design guidelines',
        icon: '📱'
      },
      {
        title: 'Android Development',
        description: 'Kotlin-based native apps with Material Design and Play Store optimization',
        icon: '🤖'
      },
      {
        title: 'Cross-Platform Apps',
        description: 'React Native and Flutter apps with 90%+ code sharing across platforms',
        icon: '🔄'
      },
      {
        title: 'App Backend & APIs',
        description: 'Scalable cloud backends with real-time sync, push notifications, and offline support',
        icon: '⚙️'
      }
    ],

    process: [
      {
        step: '1',
        title: 'Concept & Strategy',
        description: 'Define app purpose, target audience, features, and monetization strategy'
      },
      {
        step: '2',
        title: 'UX/UI Design',
        description: 'Create wireframes, prototypes, and pixel-perfect designs for iOS and Android'
      },
      {
        step: '3',
        title: 'Development & Testing',
        description: 'Build features iteratively with continuous testing on real devices'
      },
      {
        step: '4',
        title: 'Launch & Growth',
        description: 'Deploy to app stores with ASO, analytics, and post-launch optimization'
      }
    ],

    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS Amplify', 'GraphQL', 'Redux'],

    benefits: [
      'Reach millions of users on iOS and Android',
      'Deliver native-quality performance',
      'Reduce development costs with cross-platform',
      'Engage users with push notifications',
      'Monetize through in-app purchases or ads'
    ],

    caseStudies: [
      {
        client: 'EV Networks',
        project: 'Future Mobility',
        result: '320K+ active monthly users',
        link: '/work/future-mobility'
      }
    ],

    pricing: {
      starting: '$30,000',
      timeline: '4-8 months',
      model: 'Fixed price per platform or cross-platform discount'
    }
  }
];

export const ServiceDetail = () => {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!service) {
    return (
      <>
        <Navigation />
        <main className="service-not-found">
          <div className="container">
            <h1>Service Not Found</h1>
            <p>Sorry, we couldn't find the service you're looking for.</p>
            <Link to="/services" className="btn-primary">View All Services</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
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
            <p>Let's discuss how we can help transform your business</p>
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
