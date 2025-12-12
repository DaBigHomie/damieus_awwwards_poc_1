import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation, Footer, Lightbox } from '../components';
import '../styles/gallery.css';

// Gallery images data
const galleryImages = [
  {
    id: 1,
    url: '/images/gallery/quantum-dashboard.jpg',
    alt: 'Quantum Analytics Dashboard Interface',
    caption: 'Real-time analytics dashboard with AI-powered insights',
    category: 'UI/UX',
    project: 'Quantum Analytics',
    date: '2024-Q4'
  },
  {
    id: 2,
    url: '/images/gallery/neon-ar.jpg',
    alt: 'AR Product Visualization',
    caption: 'Augmented reality product preview in customer environment',
    category: 'AR/VR',
    project: 'Neon Commerce',
    date: '2024-Q4'
  },
  {
    id: 3,
    url: '/images/gallery/cyber-wallet.jpg',
    alt: 'Blockchain Wallet Interface',
    caption: 'Secure decentralized identity wallet',
    category: 'Web3',
    project: 'Cyber Identity',
    date: '2024-Q3'
  },
  {
    id: 4,
    url: '/images/gallery/mobile-charging.jpg',
    alt: 'EV Charging App',
    caption: 'Mobile app for finding and reserving charging stations',
    category: 'Mobile',
    project: 'Future Mobility',
    date: '2023-Q4'
  },
  {
    id: 5,
    url: '/images/gallery/ai-design.jpg',
    alt: 'AI Design Studio',
    caption: 'Neural-powered creative design interface',
    category: 'UI/UX',
    project: 'Neural Creative',
    date: '2024-Q2'
  },
  {
    id: 6,
    url: '/images/gallery/city-dashboard.jpg',
    alt: 'Smart City Control Center',
    caption: 'Urban infrastructure management dashboard',
    category: 'Dashboard',
    project: 'Smart City Hub',
    date: '2023-Q3'
  },
  {
    id: 7,
    url: '/images/gallery/data-viz.jpg',
    alt: 'Advanced Data Visualization',
    caption: 'Interactive data visualization with predictive analytics',
    category: 'Dashboard',
    project: 'Quantum Analytics',
    date: '2024-Q4'
  },
  {
    id: 8,
    url: '/images/gallery/mobile-checkout.jpg',
    alt: 'Mobile Checkout Experience',
    caption: 'Streamlined one-tap checkout flow',
    category: 'Mobile',
    project: 'Neon Commerce',
    date: '2024-Q4'
  },
  {
    id: 9,
    url: '/images/gallery/blockchain-viz.jpg',
    alt: 'Blockchain Network Visualization',
    caption: 'Real-time blockchain transaction visualization',
    category: 'Web3',
    project: 'Cyber Identity',
    date: '2024-Q3'
  },
  {
    id: 10,
    url: '/images/gallery/iot-network.jpg',
    alt: 'IoT Network Map',
    caption: 'Connected charging station network map',
    category: 'UI/UX',
    project: 'Future Mobility',
    date: '2023-Q4'
  },
  {
    id: 11,
    url: '/images/gallery/ai-generation.jpg',
    alt: 'AI Content Generation',
    caption: 'AI-powered design generation interface',
    category: 'UI/UX',
    project: 'Neural Creative',
    date: '2024-Q2'
  },
  {
    id: 12,
    url: '/images/gallery/traffic-control.jpg',
    alt: 'Traffic Management System',
    caption: 'AI-optimized traffic flow control',
    category: 'Dashboard',
    project: 'Smart City Hub',
    date: '2023-Q3'
  },
  {
    id: 13,
    url: '/images/gallery/product-ar-preview.jpg',
    alt: 'AR Product Preview',
    caption: 'Furniture visualization in augmented reality',
    category: 'AR/VR',
    project: 'Neon Commerce',
    date: '2024-Q4'
  },
  {
    id: 14,
    url: '/images/gallery/mobile-ev-status.jpg',
    alt: 'Charging Status Monitor',
    caption: 'Real-time charging status and energy metrics',
    category: 'Mobile',
    project: 'Future Mobility',
    date: '2023-Q4'
  },
  {
    id: 15,
    url: '/images/gallery/smart-contract.jpg',
    alt: 'Smart Contract Interface',
    caption: 'User-friendly smart contract deployment',
    category: 'Web3',
    project: 'Cyber Identity',
    date: '2024-Q3'
  }
];

const categories = ['All', 'UI/UX', 'Mobile', 'Web3', 'AR/VR', 'Dashboard'];

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImages = useMemo(() => {
    let filtered = galleryImages;

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(img => img.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(img =>
        img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeCategory, searchTerm]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Gallery | Visual Showcase | Damieus Technology Solutions</title>
        <meta name="description" content="Explore our visual gallery featuring UI/UX designs, mobile apps, Web3 projects, AR/VR experiences, and interactive dashboards. See our creative excellence." />
        <meta property="og:title" content="Gallery | Damieus Visual Showcase" />
        <meta property="og:description" content="Visual showcase of our award-winning designs and technology implementations across multiple industries." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="gallery, UI/UX design, mobile apps, web3, AR/VR, dashboard design, visual showcase" />
        <link rel="canonical" href="https://damieus.com/gallery" />
      </Helmet>
      <Navigation />
      <main className="gallery-page">
        {/* Page Header */}
        <section className="gallery-hero">
          <div className="container">
            <h1>Gallery</h1>
            <p>Visual showcase of our work across various projects and technologies</p>
          </div>
        </section>

        {/* Filters */}
        <section className="gallery-filters">
          <div className="container">
            <div className="filter-controls">
              {/* Search */}
              <div className="search-box">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18.5 18.5l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search gallery images"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="category-filter" role="navigation" aria-label="Filter by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="gallery-stats">
              <span>Showing {filteredImages.length} of {galleryImages.length} images</span>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="gallery-section">
          <div className="container">
            {filteredImages.length > 0 ? (
              <div className="gallery-grid">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id}
                    className="gallery-item"
                    onClick={() => openLightbox(index)}
                    aria-label={`View ${image.alt} in lightbox`}
                  >
                    <div className="gallery-item-image">
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        loading="lazy"
                      />
                      <div className="gallery-item-overlay">
                        <div className="overlay-content">
                          <span className="overlay-category">{image.category}</span>
                          <h3>{image.project}</h3>
                          <svg className="expand-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 3h6m0 0v6m0-6l-7 7M9 21H3m0 0v-6m0 6l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path d="M28 52c13.255 0 24-10.745 24-24S41.255 4 28 4 4 14.745 4 28s10.745 24 24 24zM58 58l-12-12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No images found</h3>
                <p>Try adjusting your filters or search term</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {lightboxOpen && (
        <Lightbox 
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};
