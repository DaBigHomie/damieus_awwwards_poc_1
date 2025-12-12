export const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <span className="section-label">WHO WE ARE</span>
            <h2>About Damieus Technology Solutions</h2>
            <p className="lead">
              At Damieus, our commitment to{' '}
              <span className="highlight">ending digital poverty</span> is rooted in
              the belief that access to technology is not a luxury, but a necessity.
            </p>
            <p>
              We are increasing business success with IT solutions. For over 25 years,
              we&apos;ve been empowering organizations with cutting-edge technology services
              that drive growth and innovation.
            </p>
            <div className="about-features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Industry-leading expertise</span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Proven track record</span>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>24/7 dedicated support</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              alt="Damieus Technology Solutions Team"
              loading="lazy"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-item">
            <h3 className="stat-number">986<span>+</span></h3>
            <p className="stat-label">Finished Projects</p>
            <div className="stat-bar"></div>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">896<span>+</span></h3>
            <p className="stat-label">Happy Clients</p>
            <div className="stat-bar"></div>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">396<span>+</span></h3>
            <p className="stat-label">Skilled Experts</p>
            <div className="stat-bar"></div>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">25<span>+</span></h3>
            <p className="stat-label">Years Experience</p>
            <div className="stat-bar"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">OUR ADVANTAGES</span>
            <h2>Why Choose Damieus?</h2>
            <p>We deal with the aspects of professional IT services with excellence</p>
          </div>
          
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 5l2.12 6.53h6.87l-5.56 4.04 2.12 6.53L20 18.06l-5.55 4.04 2.12-6.53-5.56-4.04h6.87L20 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Certified Company</h3>
              <p>Best provide skills services with industry-leading certifications and proven methodologies</p>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 10v20m-10-10h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Expert Team</h3>
              <p>100% expert team of 396+ professionals dedicated to delivering exceptional results</p>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 12v8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock online support ensuring your business never stops moving forward</p>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="10" y="10" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 20l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>High Quality Security</h3>
              <p>Enterprise-grade security protocols protecting your data and infrastructure</p>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M10 30l10-10 5 5 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 15h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Business Improvement</h3>
              <p>Proven strategies and innovative solutions that drive measurable growth</p>
            </div>
            
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 10l5 5-5 5m-5-5h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 30l-5-5 5-5m5 5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Easy Solutions</h3>
              <p>Simple, effective, and tailored solutions that fit your unique business needs</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
