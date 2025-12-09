import React from 'react';

export const Marquee = () => {
  const items = [
    'AI SOLUTIONS',
    'WEB DEVELOPMENT',
    'CLOUD INFRASTRUCTURE',
    'CYBER SECURITY',
    'DATA ANALYTICS',
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
