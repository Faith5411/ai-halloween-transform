import React, { useEffect, useState } from 'react';
import { getRemainingTokens, getUsagePercentage, getDaysUntilReset, getUsageData } from '../services/usageService';
import { TIER_TOKENS, TOKEN_COSTS, formatTokensDisplay, getTokensBreakdown } from '../constants/credits';
import type { Tier } from '../types';

interface TokenCounterProps {
  tier: Tier;
  onPurchaseTokens?: () => void;
}

const TokenCounter: React.FC<TokenCounterProps> = ({ tier, onPurchaseTokens }) => {
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [usagePercentage, setUsagePercentage] = useState(0);
  const [daysUntilReset, setDaysUntilReset] = useState(0);
  const [bonusTokens, setBonusTokens] = useState(0);

  useEffect(() => {
    const updateTokenInfo = () => {
      setRemainingTokens(getRemainingTokens(tier));
      setUsagePercentage(getUsagePercentage(tier));
      setDaysUntilReset(getDaysUntilReset());

      const usage = getUsageData(tier);
      setBonusTokens(usage.bonusTokens || 0);
    };

    updateTokenInfo();
    // Update every 5 seconds to keep UI fresh
    const interval = setInterval(updateTokenInfo, 5000);
    return () => clearInterval(interval);
  }, [tier]);

  const tierTokens = TIER_TOKENS[tier].tokens;
  const regularTokensRemaining = Math.min(remainingTokens - bonusTokens, tierTokens - (tierTokens * usagePercentage / 100));
  const maxImages = Math.floor(remainingTokens / TOKEN_COSTS.IMAGE_TRANSFORM);
  const maxVideos = Math.floor(remainingTokens / TOKEN_COSTS.VIDEO_GENERATION);

  // Calculate progress bar colors
  const getProgressColor = () => {
    if (usagePercentage < 50) return 'bg-green-500';
    if (usagePercentage < 75) return 'bg-yellow-500';
    if (usagePercentage < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getBonusColor = () => {
    return 'bg-purple-500';
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-600/30">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            Token Balance
          </h3>
          <p className="text-purple-300 text-sm mt-1">
            {tier === 'free' ? 'Lifetime tokens' : `Resets in ${daysUntilReset} days`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            {formatTokensDisplay(remainingTokens)}
          </p>
          <p className="text-purple-300 text-sm">
            of {formatTokensDisplay(tierTokens)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-purple-300 mb-1">
          <span>Used: {Math.round(usagePercentage)}%</span>
          <span>{tier === 'free' ? 'No renewal' : 'Monthly renewal'}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div className="relative h-full">
            {/* Regular tokens used */}
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500 absolute`}
              style={{ width: `${usagePercentage}%` }}
            />
            {/* Bonus tokens indicator */}
            {bonusTokens > 0 && (
              <div
                className={`h-full ${getBonusColor()} transition-all duration-500 absolute opacity-60`}
                style={{
                  left: `${usagePercentage}%`,
                  width: `${Math.min(100 - usagePercentage, (bonusTokens / tierTokens) * 100)}%`
                }}
              />
            )}
          </div>
        </div>
        {bonusTokens > 0 && (
          <p className="text-purple-400 text-xs mt-1">
            + {formatTokensDisplay(bonusTokens)} bonus tokens
          </p>
        )}
      </div>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎃</span>
            <p className="text-sm text-purple-300">Images Available</p>
          </div>
          <p className="text-2xl font-bold text-white">{maxImages}</p>
          <p className="text-xs text-purple-400">100 tokens each</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎬</span>
            <p className="text-sm text-purple-300">Videos Available</p>
          </div>
          <p className="text-2xl font-bold text-white">{maxVideos}</p>
          <p className="text-xs text-purple-400">1,000 tokens each</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t border-purple-600/20 pt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="text-purple-300">
            <p>Current tier: <span className="text-white font-semibold">{TIER_TOKENS[tier].name}</span></p>
            <p className="text-xs mt-1">Value: ${(remainingTokens / 250).toFixed(2)} remaining</p>
          </div>
          {tier !== 'free' && onPurchaseTokens && (
            <button
              onClick={onPurchaseTokens}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <span>🛒</span>
              Buy More Tokens
            </button>
          )}
        </div>
      </div>

      {/* Low Balance Warning */}
      {remainingTokens < TOKEN_COSTS.IMAGE_TRANSFORM && remainingTokens > 0 && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Not enough tokens for transformations. {tier === 'free' ? 'Upgrade to a paid plan!' : 'Purchase more tokens or wait for renewal.'}
          </p>
        </div>
      )}

      {/* Out of Tokens Warning */}
      {remainingTokens === 0 && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
          <p className="text-red-300 text-sm flex items-center gap-2">
            <span className="text-xl">🚫</span>
            Out of tokens! {tier === 'free' ? 'Upgrade to continue!' : `Renews in ${daysUntilReset} days or buy more tokens.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenCounter;