/**
 * Token-Based Credit System Configuration
 * $1 = 250 tokens
 * All transformations and features are priced in tokens
 */

export const TOKEN_RATE = 250; // tokens per dollar

export const TOKEN_COSTS = {
  IMAGE_TRANSFORM: 100,     // 100 tokens per image transformation ($0.40)
  VIDEO_GENERATION: 1000,   // 1000 tokens per 3-second video ($4.00)
} as const;

export const TIER_TOKENS = {
  free: {
    tokens: 300,           // 300 tokens lifetime (3 images, no videos)
    monthlyTokens: 0,      // No monthly renewal
    name: 'Free',
    price: 0,
    dollarValue: 1.20,    // $1.20 value
    isLifetime: true,
  },
  basic: {
    tokens: 1250,          // 1250 tokens per month ($5 value for $4.99)
    monthlyTokens: 1250,
    name: 'Basic',
    price: 4.99,
    dollarValue: 5.00,
    isLifetime: false,
  },
  pro: {
    tokens: 3750,          // 3750 tokens per month ($15 value for $14.99)
    monthlyTokens: 3750,
    name: 'Pro',
    price: 14.99,
    dollarValue: 15.00,
    isLifetime: false,
  },
  magic: {
    tokens: 7500,          // 7500 tokens per month ($30 value for $29.99)
    monthlyTokens: 7500,
    name: 'Magic',
    price: 29.99,
    dollarValue: 30.00,
    isLifetime: false,
  },
} as const;

// Token pack purchases (one-time)
export const TOKEN_PACKS = {
  small: {
    tokens: 750,           // $3 worth of tokens
    price: 2.99,
    dollarsPerToken: 0.00399,
    savings: '0%',
  },
  medium: {
    tokens: 2000,          // $8 worth of tokens
    price: 7.99,
    dollarsPerToken: 0.00400,
    savings: '0%',
  },
  large: {
    tokens: 4000,          // $16 worth of tokens
    price: 14.99,
    dollarsPerToken: 0.00375,
    savings: '6%',
  },
} as const;

// Helper functions for token calculations
export function tokensToD ollars(tokens: number): number {
  return tokens / TOKEN_RATE;
}

export function dollarsToTokens(dollars: number): number {
  return Math.floor(dollars * TOKEN_RATE);
}

export function calculateTokensNeeded(images: number, videos: number): number {
  return (images * TOKEN_COSTS.IMAGE_TRANSFORM) + (videos * TOKEN_COSTS.VIDEO_GENERATION);
}

export function getMaxImages(tokens: number): number {
  return Math.floor(tokens / TOKEN_COSTS.IMAGE_TRANSFORM);
}

export function getMaxVideos(tokens: number): number {
  return Math.floor(tokens / TOKEN_COSTS.VIDEO_GENERATION);
}

export function formatTokensDisplay(tokens: number): string {
  if (tokens === 1) return '1 token';
  if (tokens < 1000) return `${tokens} tokens`;
  if (tokens < 10000) return `${(tokens / 1000).toFixed(1)}k tokens`;
  return `${(tokens / 1000).toFixed(0)}k tokens`;
}

export function getTokensBreakdown(tokens: number): string {
  const maxImages = getMaxImages(tokens);
  const maxVideos = getMaxVideos(tokens);

  if (maxVideos === 0) {
    return `${maxImages} image${maxImages !== 1 ? 's' : ''}`;
  }

  if (maxImages === 0) {
    return `${maxVideos} video${maxVideos !== 1 ? 's' : ''}`;
  }

  return `Up to ${maxImages} images OR ${maxVideos} video${maxVideos !== 1 ? 's' : ''}`;
}

export function getTokenValueDisplay(tokens: number): string {
  const dollarValue = tokensToD ollars(tokens);
  return `$${dollarValue.toFixed(2)} value`;
}