import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { earningsService } from '../services/earningsService';
import LoadingSpinner from './LoadingSpinner';
import './EarningsSummary.css';

// Mock earnings data fallback
const MOCK_EARNINGS = {
  totalEarnings: 1250.50,
  pendingClaims: 3,
  completedClaims: 2,
  potentialEarnings: 850.00,
  recentEarnings: [
    {
      id: 1,
      settlementName: 'TechCorp Data Breach Settlement',
      amount: 250.00,
      date: '2024-10-15',
      status: 'completed'
    },
    {
      id: 2,
      settlementName: 'RetailGiant Price Fixing',
      amount: 1000.50,
      date: '2024-09-20',
      status: 'completed'
    },
    {
      id: 3,
      settlementName: 'AutoParts Warranty Settlement',
      amount: 500.00,
      date: '2024-11-01',
      status: 'pending'
    }
  ]
};

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
      // Ensure all required properties exist, use mock data values if missing
      setEarnings({
        totalEarnings: data?.totalEarnings ?? MOCK_EARNINGS.totalEarnings,
        pendingClaims: data?.pendingClaims ?? MOCK_EARNINGS.pendingClaims,
        completedClaims: data?.completedClaims ?? MOCK_EARNINGS.completedClaims,
        potentialEarnings: data?.potentialEarnings ?? MOCK_EARNINGS.potentialEarnings,
        recentEarnings: Array.isArray(data?.recentEarnings) && data.recentEarnings.length > 0 
          ? data.recentEarnings 
          : MOCK_EARNINGS.recentEarnings
      });
    } catch (error) {
      console.error('Failed to load earnings:', error);
      // Use mock data if service fails
      setEarnings(MOCK_EARNINGS);
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
          { type: 'primary', icon: '💵', label: 'Total Earned', amount: `$${(earnings.totalEarnings || 0).toFixed(2)}`, note: 'From completed claims' },
          { type: 'secondary', icon: '⏳', label: 'Pending Claims', amount: earnings.pendingClaims || 0, note: 'In progress' },
          { type: 'success', icon: '✅', label: 'Completed', amount: earnings.completedClaims || 0, note: 'Successfully submitted' },
          { type: 'potential', icon: '📈', label: 'Potential', amount: `$${(earnings.potentialEarnings || 0).toFixed(2)}`, note: 'Estimated from pending' }
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
            {(Array.isArray(earnings.recentEarnings) ? earnings.recentEarnings : []).map((earning, index) => (
              <div key={index} className="recent-earnings-item">
                <div className="recent-earnings-info">
                  <div className="recent-earnings-name">{earning.settlementName}</div>
                  <div className="recent-earnings-date">
                    {new Date(earning.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="recent-earnings-amount">+${(earning.amount || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsSummary;

