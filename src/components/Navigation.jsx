import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { MegaMenu } from './MegaMenu';

export const Navigation = () => {
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <nav>
        <Link to="/" className="logo">DAMIEUS</Link>
        <div className="nav-links">
          <button 
            onClick={() => setIsMegaMenuOpen(true)}
            className={`nav-item nav-btn ${isActive('/services') ? 'active' : ''}`}
          >
            Services
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '0.25rem' }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        <Link 
          to="/about" 
          className={`nav-item ${isActive('/about') ? 'active' : ''}`}
        >
          Agency
        </Link>
        <Link 
          to="/work" 
          className={`nav-item ${isActive('/work') ? 'active' : ''}`}
        >
          Work
        </Link>
        <Link 
          to="/gallery" 
          className={`nav-item ${isActive('/gallery') ? 'active' : ''}`}
        >
          Gallery
        </Link>
        <Link 
          to="/contact" 
          className={`nav-item ${isActive('/contact') ? 'active' : ''}`}
        >
          Contact
        </Link>
      </div>
      <div className="nav-actions">
        <Link 
          to="/onboarding" 
          className={`nav-item nav-cta ${isActive('/onboarding') ? 'active' : ''}`}
        >
          Sign Up
        </Link>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>
          EST. 2024
        </span>
      </div>
    </nav>
    <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
  </>
  );
};
