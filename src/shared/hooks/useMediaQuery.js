import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 
 * Listens to media query changes and returns boolean result.
 * Useful for responsive components.
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * if (isMobile) { return <MobileMenu />; }
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    
    // Legacy browsers
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};
