import { Link } from 'react-router-dom';
import { useState } from 'react';
import servicesData from '../data/wordpress-services.json';
import './MegaMenu.css';

export const MegaMenu = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const services = Object.values(servicesData);
  
  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'development', name: 'Development', services: ['artificial-intelligence', 'web-development', 'app-development', 'game-development'] },
    { id: 'infrastructure', name: 'Infrastructure', services: ['cloud-solutions', 'cyber-security', 'software-as-a-service'] },
    { id: 'business', name: 'Business', services: ['digital-marketing', 'e-commerce', 'nonprofits'] },
    { id: 'analytics', name: 'Analytics', services: ['data-analytics', 'business-intelligence', 'predictive-analytics'] },
  ];
  
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => {
        const category = categories.find(cat => cat.id === activeCategory);
        return category?.services?.includes(service.slug);
      });
  
  return (
    <div className={`mega-menu ${isOpen ? 'active' : ''}`}>
      <div className="mega-menu-overlay" onClick={onClose} />
      <div className="mega-menu-content">
        <div className="mega-menu-header">
          <h2>Our Services</h2>
          <button className="mega-menu-close" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        <div className="mega-menu-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
              {category.count && <span className="count">{category.count}</span>}
              {!category.count && category.services && <span className="count">{category.services.length}</span>}
            </button>
          ))}
        </div>
        
        <div className="mega-menu-grid">
          {filteredServices.map(service => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="mega-menu-item"
              onClick={onClose}
            >
              <div className="service-image">
                <img 
                  src={`/images/services/${service.slug}.jpg`} 
                  alt={service.title}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-service.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="service-number">{service.number}</div>
              </div>
              <div className="service-info">
                <h3>{service.title}</h3>
                <p>{service.tagline.substring(0, 80)}...</p>
                <span className="learn-more">
                  Learn More
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mega-menu-footer">
          <div className="footer-content">
            <div className="footer-col">
              <h4>Need Help Choosing?</h4>
              <p>Our experts can guide you to the perfect solution for your business needs.</p>
              <Link to="/contact" className="btn-contact" onClick={onClose}>
                Get Consultation
              </Link>
            </div>
            <div className="footer-col">
              <h4>Quick Stats</h4>
              <ul className="stats-list">
                <li><strong>986+</strong> Projects Delivered</li>
                <li><strong>896+</strong> Happy Clients</li>
                <li><strong>396+</strong> Expert Team</li>
                <li><strong>25+</strong> Years Experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
