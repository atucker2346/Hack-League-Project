import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './SubscriptionTier.css';

const SubscriptionTier = ({ tier, currentTier, onSelect, loading }) => {
  const isCurrent = tier.id === currentTier;
  const isPremium = tier.id === 'premium';
  const tierRef = useRef(null);

  useEffect(() => {
    if (tierRef.current) {
      const handleMouseEnter = () => {
        gsap.to(tierRef.current, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(tierRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      tierRef.current.addEventListener('mouseenter', handleMouseEnter);
      tierRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (tierRef.current) {
          tierRef.current.removeEventListener('mouseenter', handleMouseEnter);
          tierRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, []);

  return (
    <div 
      className={`subscription-tier ${isCurrent ? 'current' : ''} ${isPremium ? 'premium' : ''}`}
      ref={tierRef}
    >
      <div className="tier-header">
        <h3>{tier.name}</h3>
        <div className="tier-price">
          {tier.price === 0 ? (
            <span className="price-free">Free</span>
          ) : (
            <>
              <span className="price-amount">${tier.price}</span>
              <span className="price-period">/month</span>
            </>
          )}
        </div>
      </div>
      <div className="tier-features">
        <h4>Features:</h4>
        <ul>
          {tier.features.map((feature, index) => (
            <li key={index}>✓ {feature}</li>
          ))}
        </ul>
        {tier.limitations.length > 0 && (
          <>
            <h4>Limitations:</h4>
            <ul className="limitations">
              {tier.limitations.map((limitation, index) => (
                <li key={index}>⚠ {limitation}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button
        className={`tier-button ${isCurrent ? 'current-button' : ''}`}
        onClick={() => onSelect(tier.id)}
        disabled={isCurrent || loading}
      >
        {isCurrent ? 'Current Plan' : tier.price === 0 ? 'Select Free' : 'Upgrade'}
      </button>
    </div>
  );
};

export default SubscriptionTier;

