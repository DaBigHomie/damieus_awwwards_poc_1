import { Link } from 'react-router-dom';
import { Navigation, Footer } from '../components';

export const NotFound = () => {
  return (
    <>
      <Navigation />
      <main className="not-found-page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </main>
      <Footer />
    </>
  );
};
