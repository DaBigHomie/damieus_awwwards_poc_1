import { useState, useEffect } from 'react';

export const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader ${!isVisible ? 'loader-hide' : ''}`} id="loader">
      <div className="loader-text">DAMIEUS</div>
    </div>
  );
};
