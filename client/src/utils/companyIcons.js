// Company logo mapping - using actual logo images
export const getCompanyIcon = (companyName) => {
  const logoMap = {
    'TechCorp Inc.': '/company-logo-1.png',
    'TechCorp': '/company-logo-1.png',
    'RetailGiant': '/ups-logo.png',
    'AutoParts Co.': '/bmw-logo.png',
    'AutoParts': '/bmw-logo.png',
    'FoodBrand LLC': '/grubhub-logo.jpg',
    'FoodBrand': '/grubhub-logo.jpg'
  };

  // Try exact match first
  if (logoMap[companyName]) {
    return logoMap[companyName];
  }

  // Try partial match
  for (const [key, logo] of Object.entries(logoMap)) {
    if (companyName.includes(key) || key.includes(companyName)) {
      return logo;
    }
  }

  // Default logo
  return '/company-logo-2.png';
};

export const getCategoryIcon = (category) => {
  const categoryMap = {
    'Data Privacy': '🔒',
    'Consumer Protection': '🛡️',
    'Consumer Fraud': '⚠️',
    'False Advertising': '📢'
  };
  return categoryMap[category] || '📋';
};

