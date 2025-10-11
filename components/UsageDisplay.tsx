import React, { useState, useEffect } from 'react';
import type { Tier } from '../types';
import {
  getUsageData,
  getRemainingTransforms,
  getRemainingVideos,
  getUsagePercentage,
  getDaysUntilReset,
  getBonusTransforms,
  TIER_LIMITS,
} from '../services/usageService';
import BuyMoreTransforms from './BuyMoreTransforms';

interface UsageDisplayProps {
  tier: Tier;
  onUpgrade?: () => void;
}

const UsageDisplay: React.FC<UsageDisplayProps> = ({ tier, onUpgrade }) => {
  const [usage, setUsage] = useState(() => getUsageData(tier));
  const [remainingTransforms, setRemainingTransforms] = useState(() =>
    getRemainingTransforms(tier)
  );
  const [remainingVideos, setRemainingVideos] = useState(() =>
    getRemainingVideos(tier)
  );
  const [daysUntilReset, setDaysUntilReset] = useState(() =>
    getDaysUntilReset()
  );
  const [usagePercent, setUsagePercent] = useState(() =>
    getUsagePercentage(tier)
  );
  const [bonusTransforms, setBonusTransforms] = useState(() =>
    getBonusTransforms(tier)
  );
  const [showBuyMore, setShowBuyMore] = useState(false);

  // Update usage when tier changes or periodically
  useEffect(() => {
    const updateUsage = () => {
      setUsage(getUsageData(tier));
      setRemainingTransforms(getRemainingTransforms(tier));
      setRemainingVideos(getRemainingVideos(tier));
      setDaysUntilReset(getDaysUntilReset());
      setUsagePercent(getUsagePercentage(tier));
      setBonusTransforms(getBonusTransforms(tier));
    };

    updateUsage();

    // Update every 10 seconds to catch changes
    const interval = setInterval(updateUsage, 10000);
    return () => clearInterval(interval);
  }, [tier]);

  const transformLimit = TIER_LIMITS[tier].transforms;
  const videoLimit = TIER_LIMITS[tier].videos;

  // Determine color based on usage
  const getProgressColor = (remaining: number, limit: number) => {
    if (limit === -1) return 'bg-green-500'; // unlimited
    const percent = (remaining / limit) * 100;
    if (percent > 50) return 'bg-green-500';
    if (percent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const transformColor = getProgressColor(remainingTransforms, transformLimit);
  const videoColor = getProgressColor(remainingVideos, videoLimit);

  const showUpgradePrompt = remainingTransforms === 0 && transformLimit !== -1;

  return (
    <div className='bg-gradient-to-br from-purple-900/40 via-black/40 to-orange-900/40 border-2 border-purple-500/50 rounded-xl p-6 backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-xl font-bold text-white flex items-center gap-2'>
          <span className='text-2xl'>📊</span>
          {tier === 'basic' ? 'Usage (Lifetime)' : 'Usage This Month'}
        </h3>
        {tier !== 'basic' && (
          <div className='text-sm text-purple-300'>
            Resets in{' '}
            <span className='font-bold text-orange-400'>
              {daysUntilReset} day{daysUntilReset === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </div>

      {/* Transform Usage */}
      <div className='mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-purple-300 font-semibold flex items-center gap-2'>
            <span>🎨</span> Transforms
          </span>
          <span className='text-white font-bold'>
            {transformLimit === -1 ? (
              <span className='text-green-400'>
                {usage.transforms} (Unlimited ∞)
              </span>
            ) : (
              <>
                <span
                  className={
                    remainingTransforms === 0
                      ? 'text-red-400'
                      : 'text-green-400'
                  }
                >
                  {remainingTransforms}
                </span>{' '}
                / {transformLimit} left
              </>
            )}
          </span>
        </div>

        {/* Progress Bar */}
        {transformLimit !== -1 && (
          <div className='w-full bg-gray-700 rounded-full h-3 overflow-hidden'>
            <div
              className={`h-full ${transformColor} transition-all duration-500 rounded-full`}
              style={{
                width: `${Math.max(5, (remainingTransforms / transformLimit) * 100)}%`,
              }}
            ></div>
          </div>
        )}

        {/* Used count */}
        {transformLimit !== -1 && (
          <div className='text-xs text-gray-400 mt-1'>
            Used: {usage.transforms} / {transformLimit}
          </div>
        )}

        {/* Bonus Transforms Display */}
        {bonusTransforms > 0 && (
          <div className='text-xs text-green-400 mt-1 flex items-center gap-1'>
            <span>🎁</span>
            <span>+{bonusTransforms} bonus transforms available!</span>
          </div>
        )}
      </div>

      {/* Video Usage (only for Magic tier) */}
      {tier === 'magic' && (
        <div className='mb-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-purple-300 font-semibold flex items-center gap-2'>
              <span>🎬</span> Videos
            </span>
            <span className='text-white font-bold'>
              {videoLimit === -1 ? (
                <span className='text-green-400'>
                  {usage.videos} (Unlimited ∞)
                </span>
              ) : (
                <>
                  <span
                    className={
                      remainingVideos === 0 ? 'text-red-400' : 'text-green-400'
                    }
                  >
                    {remainingVideos}
                  </span>{' '}
                  / {videoLimit} left
                </>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          {videoLimit !== -1 && (
            <div className='w-full bg-gray-700 rounded-full h-3 overflow-hidden'>
              <div
                className={`h-full ${videoColor} transition-all duration-500 rounded-full`}
                style={{
                  width: `${Math.max(5, (remainingVideos / videoLimit) * 100)}%`,
                }}
              ></div>
            </div>
          )}

          {/* Used count */}
          {videoLimit !== -1 && (
            <div className='text-xs text-gray-400 mt-1'>
              Used: {usage.videos} / {videoLimit}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className='mt-4 p-4 bg-gradient-to-r from-orange-600/20 to-purple-600/20 border border-orange-500 rounded-lg'>
          <p className='text-orange-300 text-sm mb-3'>
            <strong>🎃 Limit Reached!</strong> You've used all your{' '}
            {tier === 'basic' ? 'free' : ''} transforms
            {tier === 'basic'
              ? '! Upgrade to continue creating.'
              : ' this month.'}
          </p>

          {/* Buy More Button */}
          <button
            onClick={() => setShowBuyMore(true)}
            className='w-full py-2 px-4 mb-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105'
          >
            Buy More Transforms 💰
          </button>

          {/* Upgrade Button */}
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className='w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105'
            >
              Or Upgrade Plan 🚀
            </button>
          )}
        </div>
      )}

      {/* Low Usage Warning */}
      {!showUpgradePrompt &&
        remainingTransforms <= 3 &&
        remainingTransforms > 0 &&
        transformLimit !== -1 && (
          <div className='mt-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg'>
            <p className='text-yellow-300 text-sm'>
              ⚠️ Only <strong>{remainingTransforms}</strong> transform
              {remainingTransforms === 1 ? '' : 's'} left
              {tier === 'basic' ? '!' : ' this month!'}
            </p>
          </div>
        )}

      {/* Current Plan Badge */}
      <div className='mt-4 pt-4 border-t border-purple-500/30 flex items-center justify-between'>
        <span className='text-sm text-gray-400'>Current Plan:</span>
        <span className='px-3 py-1 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full text-white font-bold text-sm'>
          {TIER_LIMITS[tier].name}
        </span>
      </div>

      {/* Buy More Modal */}
      {showBuyMore && (
        <BuyMoreTransforms
          remainingTransforms={remainingTransforms}
          tier={tier}
          onClose={() => setShowBuyMore(false)}
        />
      )}
    </div>
  );
};

export default UsageDisplay;
