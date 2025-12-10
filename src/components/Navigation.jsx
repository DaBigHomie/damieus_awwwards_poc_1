import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav>
      <Link to="/" className="logo">DAMIEUS</Link>
      <div className="nav-links">
        <Link 
          to="/services" 
          className={`nav-item ${isActive('/services') ? 'active' : ''}`}
        >
          Services
        </Link>
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
  );
};
