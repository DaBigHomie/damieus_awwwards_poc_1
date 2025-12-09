import React from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(1);
  const [bgOpacity, setBgOpacity] = React.useState(0);
  const cursorRef = React.useRef(null);
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setDotPosition({ x: e.clientX, y: e.clientY });

      setTimeout(() => {
        setPosition({ x: e.clientX - 10, y: e.clientY - 10 });
      }, 50);
    };

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'A' || e.target.classList.contains('card')) {
        setScale(2);
        setBgOpacity(0.1);
      }
    };

    const handleMouseLeave = (e) => {
      if (e.target.tagName === 'A' || e.target.classList.contains('card')) {
        setScale(1);
        setBgOpacity(0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
        }}
      />
      <div
        ref={cursorRef}
        className="cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${scale})`,
          backgroundColor: `rgba(255, 255, 255, ${bgOpacity})`,
        }}
      />
    </>
  );
};
