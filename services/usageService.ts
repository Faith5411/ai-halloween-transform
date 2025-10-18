// Usage tracking service with token-based system
// Tracks how many tokens users have used per billing period
// $1 = 250 tokens

import { TOKEN_COSTS, TIER_TOKENS } from '../constants/credits';

export interface UsageData {
  tokensUsed: number;      // Tokens used in current billing period
  bonusTokens: number;     // One-time purchased tokens (don't reset monthly)
  lastResetDate: string;
  tier: 'free' | 'basic' | 'pro' | 'magic';
}

// Re-export for backward compatibility
export const TIER_LIMITS = {
  free: {
    transforms: 3,
    videos: 0,
    tokens: TIER_TOKENS.free.tokens,
    name: 'Free',
    isLifetime: true,
    customPrompts: false,
  },
  basic: {
    transforms: 12, // With 1250 tokens, can do 12 images
    videos: 1,      // Or 1 video with 250 tokens left
    tokens: TIER_TOKENS.basic.tokens,
    name: 'Basic',
    isLifetime: false,
    customPrompts: false,
  },
  pro: {
    transforms: 37, // With 3750 tokens, can do 37 images
    videos: 3,      // Or 3 videos with 750 tokens left
    tokens: TIER_TOKENS.pro.tokens,
    name: 'Pro',
    isLifetime: false,
    customPrompts: true,
  },
  magic: {
    transforms: 75, // With 7500 tokens, can do 75 images
    videos: 7,      // Or 7 videos with 500 tokens left
    tokens: TIER_TOKENS.magic.tokens,
    name: 'Magic',
    isLifetime: false,
    customPrompts: true,
  },
};

const STORAGE_KEY = 'ai_halloween_usage';

/**
 * Get the first day of the current month
 */
function getCurrentBillingPeriodStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/**
 * Check if we need to reset usage (new billing period)
 */
function shouldResetUsage(lastResetDate: string): boolean {
  const lastReset = new Date(lastResetDate);
  const currentPeriodStart = new Date(getCurrentBillingPeriodStart());
  return lastReset < currentPeriodStart;
}

/**
 * Migrate old usage data to token system
 */
function migrateOldData(oldData: any): UsageData {
  // Calculate tokens used based on old transform/video counts
  const tokensFromTransforms = (oldData.transforms || 0) * TOKEN_COSTS.IMAGE_TRANSFORM;
  const tokensFromVideos = (oldData.videos || 0) * TOKEN_COSTS.VIDEO_GENERATION;
  const bonusTokens = (oldData.bonusTransforms || 0) * TOKEN_COSTS.IMAGE_TRANSFORM;

  return {
    tokensUsed: tokensFromTransforms + tokensFromVideos,
    bonusTokens: bonusTokens,
    lastResetDate: oldData.lastResetDate || getCurrentBillingPeriodStart(),
    tier: oldData.tier || 'free',
  };
}

/**
 * Get current usage data for the user
 */
export function getUsageData(tier: 'free' | 'basic' | 'pro' | 'magic'): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // First time - initialize
      return {
        tokensUsed: 0,
        bonusTokens: 0,
        lastResetDate: getCurrentBillingPeriodStart(),
        tier,
      };
    }

    const data = JSON.parse(stored);

    // Migrate old data if needed
    if ('transforms' in data || 'videos' in data) {
      const migrated = migrateOldData(data);
      saveUsageData(migrated);
      return migrated;
    }

    // For free tier (lifetime limit), never reset tokens
    if (tier === 'free') {
      // If switching to free from another tier, keep the token count
      if (data.tier !== tier) {
        return {
          tokensUsed: data.tokensUsed || 0, // Keep existing token usage for free
          bonusTokens: data.bonusTokens || 0,
          lastResetDate: getCurrentBillingPeriodStart(),
          tier,
        };
      }
      // Free tier doesn't reset
      return data;
    }

    // For paid tiers, check if tier changed or if we need to reset for new billing period
    if (data.tier !== tier || shouldResetUsage(data.lastResetDate)) {
      return {
        tokensUsed: 0, // Reset for paid tiers
        bonusTokens: data.bonusTokens || 0, // Keep bonus tokens on reset
        lastResetDate: getCurrentBillingPeriodStart(),
        tier,
      };
    }

    return data;
  } catch (error) {
    console.error('Error reading usage data:', error);
    return {
      tokensUsed: 0,
      bonusTokens: 0,
      lastResetDate: getCurrentBillingPeriodStart(),
      tier,
    };
  }
}

/**
 * Save usage data to localStorage
 */
function saveUsageData(data: UsageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving usage data:', error);
  }
}

/**
 * Check if user has enough tokens for an image transformation
 */
export function canTransform(tier: 'free' | 'basic' | 'pro' | 'magic'): boolean {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const availableTokens = tierTokens - usage.tokensUsed + usage.bonusTokens;

  return availableTokens >= TOKEN_COSTS.IMAGE_TRANSFORM;
}

/**
 * Check if user has enough tokens for a video generation
 */
export function canCreateVideo(tier: 'free' | 'basic' | 'pro' | 'magic'): boolean {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const availableTokens = tierTokens - usage.tokensUsed + usage.bonusTokens;

  return availableTokens >= TOKEN_COSTS.VIDEO_GENERATION;
}

/**
 * Use tokens for an image transformation
 */
export function incrementTransformCount(tier: 'free' | 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const tokensNeeded = TOKEN_COSTS.IMAGE_TRANSFORM;

  // Calculate available tokens
  const regularTokensAvailable = tierTokens - usage.tokensUsed;

  if (regularTokensAvailable >= tokensNeeded) {
    // Use regular tokens
    usage.tokensUsed += tokensNeeded;
    console.log(`✅ Used ${tokensNeeded} tokens for image. Tokens used: ${usage.tokensUsed}/${tierTokens}`);
  } else if (regularTokensAvailable > 0) {
    // Use remaining regular tokens and some bonus tokens
    const bonusNeeded = tokensNeeded - regularTokensAvailable;
    usage.tokensUsed = tierTokens;
    usage.bonusTokens -= bonusNeeded;
    console.log(`✅ Used ${regularTokensAvailable} regular + ${bonusNeeded} bonus tokens`);
  } else {
    // Use only bonus tokens
    usage.bonusTokens -= tokensNeeded;
    console.log(`✅ Used ${tokensNeeded} bonus tokens. Bonus remaining: ${usage.bonusTokens}`);
  }

  saveUsageData(usage);
}

/**
 * Use tokens for a video generation
 */
export function incrementVideoCount(tier: 'free' | 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const tokensNeeded = TOKEN_COSTS.VIDEO_GENERATION;

  // Calculate available tokens
  const regularTokensAvailable = tierTokens - usage.tokensUsed;

  if (regularTokensAvailable >= tokensNeeded) {
    // Use regular tokens
    usage.tokensUsed += tokensNeeded;
    console.log(`✅ Used ${tokensNeeded} tokens for video. Tokens used: ${usage.tokensUsed}/${tierTokens}`);
  } else if (regularTokensAvailable > 0) {
    // Use remaining regular tokens and some bonus tokens
    const bonusNeeded = tokensNeeded - regularTokensAvailable;
    usage.tokensUsed = tierTokens;
    usage.bonusTokens -= bonusNeeded;
    console.log(`✅ Used ${regularTokensAvailable} regular + ${bonusNeeded} bonus tokens`);
  } else {
    // Use only bonus tokens
    usage.bonusTokens -= tokensNeeded;
    console.log(`✅ Used ${tokensNeeded} bonus tokens. Bonus remaining: ${usage.bonusTokens}`);
  }

  saveUsageData(usage);
}

/**
 * Get remaining tokens for current billing period
 */
export function getRemainingTokens(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const remaining = tierTokens - usage.tokensUsed + usage.bonusTokens;
  return Math.max(0, remaining);
}

/**
 * Get remaining transforms based on available tokens
 */
export function getRemainingTransforms(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const remainingTokens = getRemainingTokens(tier);
  return Math.floor(remainingTokens / TOKEN_COSTS.IMAGE_TRANSFORM);
}

/**
 * Get remaining videos based on available tokens
 */
export function getRemainingVideos(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const remainingTokens = getRemainingTokens(tier);
  return Math.floor(remainingTokens / TOKEN_COSTS.VIDEO_GENERATION);
}

/**
 * Get usage percentage (for progress bars)
 */
export function getUsagePercentage(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;

  // All tiers have tokens, no need to check for 0
  return Math.min(100, (usage.tokensUsed / tierTokens) * 100);
}

/**
 * Get days until billing period resets
 */
export function getDaysUntilReset(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Reset usage for new billing period (called automatically)
 */
export function resetUsageIfNeeded(tier: 'free' | 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  if (shouldResetUsage(usage.lastResetDate)) {
    console.log('🔄 Resetting usage for new billing period');
    const newUsage: UsageData = {
      tokensUsed: 0,
      bonusTokens: usage.bonusTokens, // Keep bonus tokens
      lastResetDate: getCurrentBillingPeriodStart(),
      tier,
    };
    saveUsageData(newUsage);
  }
}

/**
 * Get human-readable usage summary
 */
export function getUsageSummary(tier: 'free' | 'basic' | 'pro' | 'magic'): string {
  const usage = getUsageData(tier);
  const tierTokens = TIER_TOKENS[tier].tokens;
  const remainingTokens = getRemainingTokens(tier);
  const maxImages = Math.floor(remainingTokens / TOKEN_COSTS.IMAGE_TRANSFORM);
  const maxVideos = Math.floor(remainingTokens / TOKEN_COSTS.VIDEO_GENERATION);

  const tokenText = `${remainingTokens}/${tierTokens} tokens remaining`;
  const usageText = maxVideos > 0
    ? `(${maxImages} images OR ${maxVideos} videos)`
    : `(${maxImages} images)`;

  const bonusText = usage.bonusTokens > 0
    ? ` + ${usage.bonusTokens} bonus tokens`
    : '';

  return `${tokenText} ${usageText}${bonusText}`;
}

/**
 * Add bonus tokens (from one-time purchases)
 */
export function addBonusTransforms(count: number): void {
  // Convert old "transform count" to tokens for backward compatibility
  const bonusTokens = count * TOKEN_COSTS.IMAGE_TRANSFORM;
  addBonusTokens(bonusTokens);
}

/**
 * Add bonus tokens directly
 */
export function addBonusTokens(tokens: number): void {
  const currentTier =
    (localStorage.getItem('userTier') as 'free' | 'basic' | 'pro' | 'magic') || 'free';
  const usage = getUsageData(currentTier);
  usage.bonusTokens = (usage.bonusTokens || 0) + tokens;
  saveUsageData(usage);
  console.log(`✅ Added ${tokens} bonus tokens! Total: ${usage.bonusTokens}`);
}

/**
 * Get bonus tokens available
 */
export function getBonusTransforms(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  // Return as "transform count" for backward compatibility
  return Math.floor(usage.bonusTokens / TOKEN_COSTS.IMAGE_TRANSFORM);
}

/**
 * Get bonus tokens directly
 */
export function getBonusTokens(tier: 'free' | 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  return usage.bonusTokens || 0;
}

export default {
  canTransform,
  canCreateVideo,
  incrementTransformCount,
  incrementVideoCount,
  getRemainingTokens,
  getRemainingTransforms,
  getRemainingVideos,
  getUsagePercentage,
  getDaysUntilReset,
  resetUsageIfNeeded,
  getUsageData,
  getUsageSummary,
  addBonusTransforms,
  addBonusTokens,
  getBonusTransforms,
  getBonusTokens,
  TIER_LIMITS,
};