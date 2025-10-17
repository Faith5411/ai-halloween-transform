// Usage tracking service for transform limits
// Tracks how many transforms users have made per billing period

export interface UsageData {
  transforms: number;
  videos: number;
  bonusTransforms: number; // One-time purchases (don't reset monthly)
  lastResetDate: string;
  tier: 'basic' | 'pro' | 'magic';
}

// Tier limits
export const TIER_LIMITS = {
  basic: {
    transforms: 3, // 3 lifetime for free tier
    videos: 0,
    name: 'Basic (FREE)',
    isLifetime: true, // This is a lifetime limit, not monthly
  },
  pro: {
    transforms: 30, // 30 per month
    videos: 0,
    name: 'Pro',
    isLifetime: false,
  },
  magic: {
    transforms: 35, // 35 per month
    videos: 35, // 35 per month
    name: 'Magic',
    isLifetime: false,
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
 * Get current usage data for the user
 */
export function getUsageData(tier: 'basic' | 'pro' | 'magic'): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      // First time - initialize
      return {
        transforms: 0,
        videos: 0,
        bonusTransforms: 0,
        lastResetDate: getCurrentBillingPeriodStart(),
        tier,
      };
    }

    const data: UsageData = JSON.parse(stored);

    // For basic tier (lifetime limit), never reset transforms
    if (tier === 'basic') {
      // If switching to basic from another tier, keep the transform count
      if (data.tier !== tier) {
        return {
          transforms: data.transforms || 0, // Keep existing transform count for basic
          videos: 0,
          bonusTransforms: data.bonusTransforms || 0,
          lastResetDate: getCurrentBillingPeriodStart(),
          tier,
        };
      }
      // Basic tier doesn't reset
      return data;
    }

    // For paid tiers, check if tier changed or if we need to reset for new billing period
    if (data.tier !== tier || shouldResetUsage(data.lastResetDate)) {
      return {
        transforms: 0, // Reset for paid tiers
        videos: 0,
        bonusTransforms: data.bonusTransforms || 0, // Keep bonus transforms on reset
        lastResetDate: getCurrentBillingPeriodStart(),
        tier,
      };
    }

    return data;
  } catch (error) {
    console.error('Error reading usage data:', error);
    return {
      transforms: 0,
      videos: 0,
      bonusTransforms: 0,
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
 * Check if user can create a transformation
 */
export function canTransform(tier: 'basic' | 'pro' | 'magic'): boolean {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].transforms;

  // -1 means unlimited
  if (limit === -1) return true;

  // Can transform if within regular limit OR have bonus transforms
  return usage.transforms < limit || usage.bonusTransforms > 0;
}

/**
 * Check if user can create a video
 */
export function canCreateVideo(tier: 'basic' | 'pro' | 'magic'): boolean {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].videos;

  // -1 means unlimited
  if (limit === -1) return true;

  return usage.videos < limit;
}

/**
 * Increment transformation count
 */
export function incrementTransformCount(tier: 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].transforms;

  // Use bonus transforms first if available and regular limit is reached
  if (limit !== -1 && usage.transforms >= limit && usage.bonusTransforms > 0) {
    usage.bonusTransforms -= 1;
    console.log(
      `✅ Used bonus transform! Bonus remaining: ${usage.bonusTransforms}`
    );
  } else {
    usage.transforms += 1;
    console.log(
      `✅ Transform count: ${usage.transforms}/${
        TIER_LIMITS[tier].transforms === -1 ? '∞' : TIER_LIMITS[tier].transforms
      }`
    );
  }

  saveUsageData(usage);
}

/**
 * Increment video count
 */
export function incrementVideoCount(tier: 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  usage.videos += 1;
  saveUsageData(usage);
  console.log(
    `✅ Video count: ${usage.videos}/${TIER_LIMITS[tier].videos === -1 ? '∞' : TIER_LIMITS[tier].videos}`
  );
}

/**
 * Get remaining transforms for current billing period
 */
export function getRemainingTransforms(
  tier: 'basic' | 'pro' | 'magic'
): number {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].transforms;

  if (limit === -1) return -1; // unlimited

  const remaining = limit - usage.transforms;
  return Math.max(0, remaining) + usage.bonusTransforms;
}

/**
 * Get remaining videos for current billing period
 */
export function getRemainingVideos(tier: 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].videos;

  if (limit === -1) return -1; // unlimited

  const remaining = limit - usage.videos;
  return Math.max(0, remaining);
}

/**
 * Get usage percentage (for progress bars)
 */
export function getUsagePercentage(tier: 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].transforms;

  if (limit === -1) return 0; // unlimited = no percentage

  return Math.min(100, (usage.transforms / limit) * 100);
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
export function resetUsageIfNeeded(tier: 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  if (shouldResetUsage(usage.lastResetDate)) {
    console.log('🔄 Resetting usage for new billing period');
    const newUsage: UsageData = {
      transforms: 0,
      videos: 0,
      bonusTransforms: usage.bonusTransforms, // Keep bonus transforms
      lastResetDate: getCurrentBillingPeriodStart(),
      tier,
    };
    saveUsageData(newUsage);
  }
}

/**
 * Get human-readable usage summary
 */
export function getUsageSummary(tier: 'basic' | 'pro' | 'magic'): string {
  const usage = getUsageData(tier);
  const transformLimit = TIER_LIMITS[tier].transforms;
  const videoLimit = TIER_LIMITS[tier].videos;

  const transformText =
    transformLimit === -1
      ? `${usage.transforms} transforms (unlimited)`
      : `${usage.transforms}/${transformLimit} transforms`;

  const videoText =
    videoLimit === -1
      ? `${usage.videos} videos (unlimited)`
      : videoLimit === 0
        ? 'No videos'
        : `${usage.videos}/${videoLimit} videos`;

  const bonusText =
    usage.bonusTransforms > 0
      ? ` + ${usage.bonusTransforms} bonus transforms`
      : '';

  return `${transformText}${bonusText}, ${videoText}`;
}

/**
 * Add bonus transforms (from one-time purchases)
 */
export function addBonusTransforms(count: number): void {
  // We'll store this for the current tier, but it persists across tier changes
  const currentTier =
    (localStorage.getItem('userTier') as 'basic' | 'pro' | 'magic') || 'basic';
  const usage = getUsageData(currentTier);
  usage.bonusTransforms = (usage.bonusTransforms || 0) + count;
  saveUsageData(usage);
  console.log(
    `✅ Added ${count} bonus transforms! Total: ${usage.bonusTransforms}`
  );
}

/**
 * Get bonus transforms available
 */
export function getBonusTransforms(tier: 'basic' | 'pro' | 'magic'): number {
  const usage = getUsageData(tier);
  return usage.bonusTransforms || 0;
}

export default {
  canTransform,
  canCreateVideo,
  incrementTransformCount,
  incrementVideoCount,
  getRemainingTransforms,
  getRemainingVideos,
  getUsagePercentage,
  getDaysUntilReset,
  resetUsageIfNeeded,
  getUsageData,
  getUsageSummary,
  addBonusTransforms,
  getBonusTransforms,
  TIER_LIMITS,
};
