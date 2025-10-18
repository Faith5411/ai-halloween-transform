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
  free: {
    name: 'Free',
    price: 0,
    features: [
      '3 image transforms',
      'Basic Halloween costumes',
      'Standard processing',
    ],
  },
  basic: {
    name: 'Basic',
    price: 4.99,
    features: [
      '10 image transforms per month',
      'All Halloween costumes',
      'Priority processing',
    ],
  },
  pro: {
    name: 'Pro',
    price: 14.99,
    features: [
      '30 image transforms per month',
      'All Basic features',
      'Custom costume prompts',
      'Highest quality outputs',
    ],
  },
  magic: {
    name: 'Magic',
    price: 29.99,
    features: [
      '30 image transforms per month',
      '4 video animations per month',
      'All Pro features',
      '3-second spooky animations',
      'Early access to new features',
    ],
  },
};
