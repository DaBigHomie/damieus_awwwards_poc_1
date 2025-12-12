export const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="about" id="about">
        <div className="about-text">
          <h2 style={{ marginBottom: '2rem' }}>About Damieus Technology Solutions</h2>
          <p>
            At Damieus, our commitment to{' '}
            <span className="highlight">ending digital poverty</span> is rooted in
            the belief that access to technology is not a luxury, but a necessity.
          </p>
          <p>
            We are increasing business success with IT solutions. For over 25 years,
            we've been empowering organizations with cutting-edge technology services
            that drive growth and innovation.
          </p>
        </div>
        <div
          style={{
            flex: 1,
            height: '400px',
            background: '#222',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
            alt="Damieus Technology Solutions"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.6,
            }}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              color: 'var(--accent)', 
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-display)'
            }}>986+</h3>
            <p style={{ color: 'var(--text-muted)' }}>Finished Projects</p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              color: 'var(--accent)', 
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-display)'
            }}>896+</h3>
            <p style={{ color: 'var(--text-muted)' }}>Happy Clients</p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              color: 'var(--accent)', 
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-display)'
            }}>396+</h3>
            <p style={{ color: 'var(--text-muted)' }}>Skilled Experts</p>
          </div>
          <div>
            <h3 style={{ 
              fontSize: '3rem', 
              color: 'var(--accent)', 
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-display)'
            }}>25+</h3>
            <p style={{ color: 'var(--text-muted)' }}>Years Experience</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Damieus?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            We deal with the aspects of professional IT services with excellence
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ Certified Company</h3>
            <p style={{ color: 'var(--text-muted)' }}>Best provide skills services with industry-leading certifications</p>
          </div>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ Expert Team</h3>
            <p style={{ color: 'var(--text-muted)' }}>100% expert team dedicated to your success</p>
          </div>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ 24/7 Support</h3>
            <p style={{ color: 'var(--text-muted)' }}>Round-the-clock online support for all your needs</p>
          </div>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ High Quality Security</h3>
            <p style={{ color: 'var(--text-muted)' }}>Enterprise-grade security for your business</p>
          </div>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ Business Improvement</h3>
            <p style={{ color: 'var(--text-muted)' }}>Proven strategies to grow your business</p>
          </div>
          <div style={{ padding: '2rem', background: '#111', borderRadius: '8px', border: '1px solid #222' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>✓ Easy Solutions</h3>
            <p style={{ color: 'var(--text-muted)' }}>Simple, effective solutions tailored to you</p>
          </div>
        </div>
      </section>
    </>
  );
};
