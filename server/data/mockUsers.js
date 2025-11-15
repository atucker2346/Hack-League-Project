// Mock user database
const users = [
  {
    id: 1,
    email: 'demo@example.com',
    password: '$2a$10$rOzJqKqKqKqKqKqKqKqKqO', // "password" hashed
    name: 'Kennedy',
    address: '123 Main St, Anytown, ST 12345',
    phone: '555-0100',
    subscriptionTier: 'premium',
    createdAt: new Date('2024-01-15')
  }
];

// Mock receipts/purchase history
const userReceipts = {
  1: [
    {
      id: 1,
      date: '2023-06-15',
      merchant: 'Amazon',
      amount: 89.99,
      product: 'Wireless Headphones',
      category: 'Electronics'
    },
    {
      id: 2,
      date: '2023-08-22',
      merchant: 'Target',
      amount: 45.50,
      product: 'Household Items',
      category: 'Home'
    },
    {
      id: 3,
      date: '2023-11-10',
      merchant: 'Best Buy',
      amount: 299.99,
      product: 'Smart TV',
      category: 'Electronics'
    }
  ]
};

module.exports = { users, userReceipts };

