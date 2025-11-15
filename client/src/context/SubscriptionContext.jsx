import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from './AuthContext';

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
      setTiers(results[0]);
      if (isAuthenticated && results[1]) {
        setSubscription(results[1]);
      }
    } catch (error) {
      console.error('Failed to load subscription data:', error);
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

