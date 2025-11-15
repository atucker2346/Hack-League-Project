// Simple client-side authentication for showcase - no API calls needed
// Any email/password combination will work

export const authService = {
  register: async (email, password, name) => {
    // For showcase: accept any registration, no API needed
    return {
      user: {
        id: Date.now(),
        email: email || 'user@example.com',
        name: name || 'User',
        subscriptionTier: 'free'
      },
      token: 'demo-token-' + Date.now()
    };
  },

  login: async (email, password) => {
    // For showcase: accept any login credentials, no API needed
    // Special handling for demo credentials to show premium tier
    const isDemo = email === 'demo@example.com' && password === 'password';
    
    return {
      user: {
        id: isDemo ? 1 : Date.now(),
        email: email || 'user@example.com',
        name: isDemo ? 'Kennedy' : (email?.split('@')[0] || 'User'),
        subscriptionTier: isDemo ? 'premium' : 'free'
      },
      token: 'demo-token-' + Date.now()
    };
  }
};

