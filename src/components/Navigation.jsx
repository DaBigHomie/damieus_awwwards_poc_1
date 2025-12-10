import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <Link to="/" className="logo">DAMIEUS</Link>
      <div className="nav-links">
        <Link to="/services" className="nav-item">Services</Link>
        <Link to="/about" className="nav-item">Agency</Link>
        <Link to="/work" className="nav-item">Work</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
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
