// Stripe Payment Links Configuration
// Replace these with your actual payment links from Stripe Dashboard

export const STRIPE_PAYMENT_LINKS = {
  basic: 'https://buy.stripe.com/28E14n4rYeqafJNbDz73G02',
  pro: 'https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05',
  magic: 'https://buy.stripe.com/eVqeVd8Ie3Lw2X1ePL73G06',
};

// Transform Pack Payment Links (One-Time Purchases)
export const TRANSFORM_PACK_LINKS = {
  pack5: {
    url: 'https://buy.stripe.com/bJeeVd0bI81M9lp0YV73G07',
    transforms: 5,
    price: '$2.99',
    priceValue: 2.99,
  },
  pack10: {
    url: 'https://buy.stripe.com/8x28wP0bIci2cxB4b773G08',
    transforms: 10,
    price: '$4.99',
    priceValue: 4.99,
  },
  pack25: {
    url: 'https://buy.stripe.com/14A5kDcYuci24156jf73G09',
    transforms: 25,
    price: '$9.99',
    priceValue: 9.99,
  },
};

// ✅ Payment Links Configuration Complete!
// All payment plans and transform packs are now configured and ready to use.
// Users can click "Subscribe Now" and will be redirected to Stripe checkout.
//
// Monthly Plans:
// Free: 3 image transforms (no subscription needed)
// Basic: $4.99/month - 10 image transforms
// Pro: $14.99/month - 30 image transforms
// Magic: $29.99/month - 30 image transforms + 4 videos
//
// One-Time Transform Packs:
// 5 Transforms: $2.99
// 10 Transforms: $4.99
// 25 Transforms: $9.99
