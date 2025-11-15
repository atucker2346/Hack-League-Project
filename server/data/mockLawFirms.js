// Mock law firm database
const lawFirms = [
  {
    id: 1,
    name: 'Smith & Associates Class Action Law',
    email: 'support@smithlaw.com',
    phone: '1-800-555-0100',
    website: 'https://smithlaw.com',
    specialties: ['Data Privacy', 'Consumer Protection'],
    settlements: [1, 2], // Settlement IDs they handle
    benefits: [
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Regular settlement updates',
      'Access to claim administrators',
      'Expert legal guidance'
    ],
    description: 'Leading class action law firm specializing in data privacy and consumer protection cases. We have successfully represented thousands of clients in major settlements.',
    logo: '/law-firm-logo.jpg'
  },
  {
    id: 2,
    name: 'Consumer Rights Legal Group',
    email: 'info@consumerrightslaw.com',
    phone: '1-800-555-0200',
    website: 'https://consumerrightslaw.com',
    specialties: ['Consumer Fraud', 'False Advertising'],
    settlements: [3], // Settlement IDs they handle
    benefits: [
      'Direct attorney support',
      'Priority claim processing',
      'Higher payout opportunities',
      'Regular settlement updates',
      'Access to claim administrators',
      'Expert legal guidance'
    ],
    description: 'Dedicated to protecting consumer rights through class action litigation. Our team has recovered millions in settlements for consumers nationwide.',
    logo: '/law-firm-logo.jpg'
  }
];

// Mock updates from law firms
const lawFirmUpdates = {
  1: [ // Updates from law firm 1
    {
      id: 1,
      settlementId: 1,
      title: 'Important Deadline Reminder',
      content: 'The deadline for the TechCorp Data Breach Settlement is approaching. Please submit your claim by December 31, 2024 to ensure eligibility.',
      date: '2024-11-15',
      type: 'deadline'
    },
    {
      id: 2,
      settlementId: 1,
      title: 'Payout Information Update',
      content: 'We have received confirmation that payouts for approved claims will begin processing in Q1 2025. Estimated amounts range from $50-$500 based on individual circumstances.',
      date: '2024-11-10',
      type: 'payout'
    },
    {
      id: 3,
      settlementId: 2,
      title: 'Settlement Status Update',
      content: 'The RetailGiant Price Fixing settlement is progressing well. All eligible claims are being reviewed by the claims administrator.',
      date: '2024-11-05',
      type: 'status'
    }
  ],
  2: [ // Updates from law firm 2
    {
      id: 4,
      settlementId: 3,
      title: 'Extended Warranty Settlement Update',
      content: 'We are pleased to announce that the AutoParts Warranty Settlement has been approved. Claim submissions are now being processed.',
      date: '2024-11-12',
      type: 'status'
    },
    {
      id: 5,
      settlementId: 3,
      title: 'Higher Payout Opportunities',
      content: 'Clients working with our firm may be eligible for higher payouts due to our direct relationship with the claims administrator. Contact us for more information.',
      date: '2024-11-08',
      type: 'payout'
    }
  ]
};

module.exports = { lawFirms, lawFirmUpdates };

