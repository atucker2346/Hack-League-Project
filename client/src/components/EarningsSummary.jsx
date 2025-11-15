import { useEffect, useState, useRef } from 'react';
import { earningsService } from '../services/earningsService';
import LoadingSpinner from './LoadingSpinner';
import './EarningsSummary.css';

const EarningsCard = ({ type, icon, label, amount, note }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          y: -6,
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
          cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, []);

  return (
    <div className={`earnings-card ${type}`} ref={cardRef}>
      <div className="earnings-icon">{icon}</div>
      <div className="earnings-content">
        <div className="earnings-label">{label}</div>
        <div className="earnings-amount">{amount}</div>
        <div className="earnings-note">{note}</div>
      </div>
    </div>
  );
};

const EarningsSummary = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    loadEarnings();
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [loading, earnings]);

  const loadEarnings = async () => {
    try {
      const data = await earningsService.getTotalEarnings();
      setEarnings(data);
    } catch (error) {
      console.error('Failed to load earnings:', error);
      // Set default values if service fails
      setEarnings({
        totalEarnings: 0,
        pendingClaims: 0,
        completedClaims: 0,
        potentialEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="earnings-summary">
        <LoadingSpinner />
      </div>
    );
  }

  if (!earnings) {
    return null;
  }

  return (
    <div className="earnings-summary" ref={containerRef}>
      <div className="earnings-header" ref={headerRef}>
        <h2>💰 Your Earnings</h2>
        <p className="earnings-subtitle">Track your settlement claims</p>
      </div>
      
      <div className="earnings-grid" ref={cardsRef}>
        {[
          { type: 'primary', icon: '💵', label: 'Total Earned', amount: `$${earnings.totalEarnings.toFixed(2)}`, note: 'From completed claims' },
          { type: 'secondary', icon: '⏳', label: 'Pending Claims', amount: earnings.pendingClaims, note: 'In progress' },
          { type: 'success', icon: '✅', label: 'Completed', amount: earnings.completedClaims, note: 'Successfully submitted' },
          { type: 'potential', icon: '📈', label: 'Potential', amount: `$${earnings.potentialEarnings.toFixed(2)}`, note: 'Estimated from pending' }
        ].map((card, index) => (
          <EarningsCard
            key={index}
            type={card.type}
            icon={card.icon}
            label={card.label}
            amount={card.amount}
            note={card.note}
          />
        ))}
      </div>

      {earnings.recentEarnings && earnings.recentEarnings.length > 0 && (
        <div className="recent-earnings">
          <h3>Recent Earnings</h3>
          <div className="recent-earnings-list">
            {earnings.recentEarnings.map((earning, index) => (
              <div key={index} className="recent-earnings-item">
                <div className="recent-earnings-info">
                  <div className="recent-earnings-name">{earning.settlementName}</div>
                  <div className="recent-earnings-date">
                    {new Date(earning.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="recent-earnings-amount">+${earning.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsSummary;

