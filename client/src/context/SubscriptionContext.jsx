import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

// Fallback mock tiers in case service fails
const FALLBACK_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'View up to 3 settlements',
      'Basic auto-fill assistance',
      'Manual form review'
    ],
    limitations: [
      'Limited to 3 settlements per month',
      'No receipt scanning',
      'No email integration',
      'No access to Partnered Law Firms'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited settlements',
      'Advanced auto-fill',
      'Receipt scanning',
      'Email integration',
      'Priority support',
      'Export claim data',
      'Access to Partnered Law Firms',
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Settlement updates from law firms',
      'Access to claim administrators'
    ],
    limitations: []
  }
];

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always load subscription data (tiers) even if not authenticated
    loadSubscriptionData();
  }, [isAuthenticated]);

  const loadSubscriptionData = async () => {
    try {
      // Always load tiers, only load status if authenticated
      const promises = [subscriptionService.getTiers()];
      if (isAuthenticated) {
        promises.push(subscriptionService.getStatus());
      }
      
      const results = await Promise.all(promises);
      // Ensure tiers is always an array with data
      const tiersData = Array.isArray(results[0]) && results[0].length > 0 ? results[0] : FALLBACK_TIERS;
      setTiers(tiersData);
      if (isAuthenticated && results[1]) {
        setSubscription(results[1]);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      // On error, still try to get tiers directly
      try {
        const tiersData = await subscriptionService.getTiers();
        setTiers(Array.isArray(tiersData) && tiersData.length > 0 ? tiersData : FALLBACK_TIERS);
      } catch (e) {
        console.error('Failed to load tiers:', e);
        setTiers(FALLBACK_TIERS); // Use fallback tiers as last resort
      }
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubscription = async (tier) => {
    try {
      const data = await subscriptionService.subscribe(tier);
      setSubscription(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Subscription update failed'
      };
    }
  };

  const value = {
    subscription,
    tiers,
    loading,
    upgradeSubscription,
    refreshSubscription: loadSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

