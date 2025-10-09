// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  // Replace these with your actual price IDs from Stripe Dashboard
  prices: {
    basic: process.env.STRIPE_PRICE_BASIC || 'price_basic',
    pro: process.env.STRIPE_PRICE_PRO || 'price_pro', 
    magic: process.env.STRIPE_PRICE_MAGIC || 'price_magic',
  },
};

export const PLAN_DETAILS = {
  basic: {
    name: 'Basic',
    price: 4.99,
    features: [
      'Upload your photo',
      'Pick from preset costumes',
      'Generate unlimited images',
    ],
  },
  pro: {
    name: 'Pro',
    price: 12.99,
    features: [
      'All Basic features',
      'Use custom prompts',
      'Priority processing',
    ],
  },
  magic: {
    name: 'Magic',
    price: 29.99,
    features: [
      'All Pro features',
      'Generate 5-second videos',
      'Access to new AI models',
    ],
  },
};
