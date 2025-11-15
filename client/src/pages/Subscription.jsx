import { useState, useEffect, useRef } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import SubscriptionTier from '../components/SubscriptionTier';
import LoadingSpinner from '../components/LoadingSpinner';
import './Subscription.css';

const Subscription = () => {
  const { subscription, tiers, loading, upgradeSubscription } = useSubscription();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const headerRef = useRef(null);
  const tiersRef = useRef(null);

  useEffect(() => {
    // Load subscription context is handled by provider
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [loading]);

  const handleSelectTier = async (tierId) => {
    setUpdating(true);
    setMessage({ type: '', text: '' });

    const result = await upgradeSubscription(tierId);

    if (result.success) {
      setMessage({
        type: 'success',
        text: `Successfully ${tierId === 'free' ? 'downgraded' : 'upgraded'} to ${tierId} plan!`
      });
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Failed to update subscription'
      });
    }

    setUpdating(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const tiersArray = Array.isArray(tiers) ? tiers : [];

  return (
    <div className="subscription-page">
      <div className="subscription-header" ref={headerRef}>
        <h1>Subscription Plans</h1>
        <p>Choose the plan that works best for you</p>
        {subscription && subscription.tier && (
          <div className="current-status">
            Current Plan: <strong>{(subscription.tier || '').toUpperCase()}</strong>
          </div>
        )}
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {tiersArray.length === 0 ? (
        <div className="no-tiers">
          <p>No subscription tiers available at this time.</p>
        </div>
      ) : (
        <div className="tiers-container" ref={tiersRef}>
          {tiersArray.map((tier) => (
            <SubscriptionTier
              key={tier.id}
              tier={tier}
              currentTier={subscription?.tier}
              onSelect={handleSelectTier}
              loading={updating}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Subscription;

