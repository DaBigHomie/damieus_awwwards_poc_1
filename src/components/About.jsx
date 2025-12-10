export const About = () => {
  return (
    <section className="about" id="about">
      <div className="about-text">
        <h2 style={{ marginBottom: '2rem' }}>The Mission</h2>
        <p>
          At Damieus, our commitment to{' '}
          <span className="highlight">ending digital poverty</span> is rooted in
          the belief that access to technology is not a luxury, but a necessity.
        </p>
        <p>
          We empower startups and enterprises alike to bridge the gap between
          potential and reality.
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
          alt="Technology"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
};
