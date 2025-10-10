// Usage tracking service for transform limits
// Tracks how many transforms users have made per billing period

export interface UsageData {
  transforms: number;
  videos: number;
  lastResetDate: string;
  tier: 'basic' | 'pro' | 'magic';
}

// Tier limits per month
export const TIER_LIMITS = {
  basic: {
    transforms: 10,
    videos: 0,
    name: 'Basic',
  },
  pro: {
    transforms: 30,
    videos: 0,
    name: 'Pro',
  },
  magic: {
    transforms: 35,
    videos: 35,
    name: 'Magic',
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
        lastResetDate: getCurrentBillingPeriodStart(),
        tier,
      };
    }

    const data: UsageData = JSON.parse(stored);

    // Check if tier changed or if we need to reset for new billing period
    if (data.tier !== tier || shouldResetUsage(data.lastResetDate)) {
      return {
        transforms: 0,
        videos: 0,
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
 * Check if user can perform a transform
 */
export function canTransform(tier: 'basic' | 'pro' | 'magic'): boolean {
  const usage = getUsageData(tier);
  const limit = TIER_LIMITS[tier].transforms;

  // -1 means unlimited
  if (limit === -1) return true;

  return usage.transforms < limit;
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
 * Increment transform count
 */
export function incrementTransformCount(tier: 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  usage.transforms += 1;
  usage.tier = tier;
  saveUsageData(usage);
  console.log(
    `✅ Transform count: ${usage.transforms}/${TIER_LIMITS[tier].transforms === -1 ? '∞' : TIER_LIMITS[tier].transforms}`
  );
}

/**
 * Increment video count
 */
export function incrementVideoCount(tier: 'basic' | 'pro' | 'magic'): void {
  const usage = getUsageData(tier);
  usage.videos += 1;
  usage.tier = tier;
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
  return Math.max(0, remaining);
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
 * Get usage percentage (0-100)
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
  const diff = nextMonth.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Reset usage manually (for testing)
 */
export function resetUsage(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('✅ Usage data reset');
}

/**
 * Get formatted usage summary
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
      : `${usage.videos}/${videoLimit} videos`;

  const daysLeft = getDaysUntilReset();

  return `${transformText}, ${videoText} | Resets in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
}

export default {
  getUsageData,
  canTransform,
  canCreateVideo,
  incrementTransformCount,
  incrementVideoCount,
  getRemainingTransforms,
  getRemainingVideos,
  getUsagePercentage,
  getDaysUntilReset,
  resetUsage,
  getUsageSummary,
  TIER_LIMITS,
};
