import { useEffect, useRef } from 'react';
import './SpaceBackground.css';

const SpaceBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    const numStars = 150;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size (1px to 3px)
      const size = Math.random() * 2 + 1;
      
      // Random animation duration (3s to 8s)
      const duration = Math.random() * 5 + 3;
      
      // Random delay
      const delay = Math.random() * 2;
      
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      
      // Random twinkle pattern
      const twinklePattern = Math.random();
      if (twinklePattern > 0.7) {
        star.classList.add('star-fast');
      } else if (twinklePattern > 0.4) {
        star.classList.add('star-medium');
      } else {
        star.classList.add('star-slow');
      }
      
      container.appendChild(star);
      stars.push(star);
    }

    // Cleanup
    return () => {
      stars.forEach(star => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="space-background" />;
};

export default SpaceBackground;

