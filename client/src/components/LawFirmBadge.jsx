import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { lawFirmService } from '../services/lawFirmService';
import './LawFirmBadge.css';

const LawFirmBadge = ({ settlementId }) => {
  const { subscription } = useSubscription();
  const [hasPartnership, setHasPartnership] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPartnership();
  }, [settlementId, subscription]);

  const checkPartnership = async () => {
    try {
      const data = await lawFirmService.checkPartnership(settlementId);
      setHasPartnership(data.hasPartneredLawFirm);
      setHasAccess(data.hasAccess);
    } catch (error) {
      console.error('Failed to check partnership:', error);
      setHasPartnership(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !hasPartnership) {
    return null;
  }

  const isPremium = subscription?.tier === 'premium';

  return (
    <div className="law-firm-badge">
      <div className="badge-icon">⚖️</div>
      <div className="badge-content">
        <div className="badge-title">Partnered Law Firm</div>
        <div className="badge-subtitle">
          {isPremium ? 'Premium Access Available' : 'Upgrade to Premium'}
        </div>
      </div>
      {isPremium ? (
        <Link 
          to={`/lawfirm/settlement/${settlementId}`}
          className="badge-link"
        >
          View Details →
        </Link>
      ) : (
        <Link 
          to="/subscription"
          className="badge-link upgrade"
        >
          Upgrade →
        </Link>
      )}
    </div>
  );
};

export default LawFirmBadge;

