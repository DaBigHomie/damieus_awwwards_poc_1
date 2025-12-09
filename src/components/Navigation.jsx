import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <Link to="/" className="logo">DAMIEUS</Link>
      <div className="nav-links">
        <a href="#services" className="nav-item">Services</a>
        <a href="#about" className="nav-item">Agency</a>
        <a href="#work" className="nav-item">Work</a>
        <a href="#contact" className="nav-item">Contact</a>
      </div>
      <div className="nav-actions">
        <Link to="/onboarding" className="nav-item nav-cta">Sign Up</Link>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>
          EST. 2024
        </span>
      </div>
    </nav>
  );
};
