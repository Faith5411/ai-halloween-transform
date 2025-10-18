import React, { useState, useEffect } from 'react';
import {
  getUsageData,
  getRemainingTokens,
  getDaysUntilReset,
  getUsageSummary
} from '../services/usageService';
import {
  TIER_TOKENS,
  TOKEN_COSTS,
  formatTokensDisplay,
  tokensToD ollars
} from '../constants/credits';
import type { Tier } from '../types';
import TokenCounter from './TokenCounter';
import TokenPacks from './TokenPacks';

interface TokenDashboardProps {
  tier: Tier;
  onClose?: () => void;
  onUpgrade?: () => void;
}

interface UsageHistory {
  date: string;
  action: 'image' | 'video';
  tokensUsed: number;
  remainingTokens: number;
}

const TokenDashboard: React.FC<TokenDashboardProps> = ({ tier, onClose, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'purchase'>('overview');
  const [usageData, setUsageData] = useState<any>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    const data = getUsageData(tier);
    setUsageData(data);

    // Load usage history from localStorage (in production, this would come from backend)
    const historyKey = `token_usage_history_${tier}`;
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      try {
        setUsageHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse usage history:', e);
      }
    }
  }, [tier]);

  if (!usageData) return null;

  const tierInfo = TIER_TOKENS[tier];
  const remainingTokens = getRemainingTokens(tier);
  const usedTokens = usageData.tokensUsed;
  const bonusTokens = usageData.bonusTokens || 0;
  const daysUntilReset = getDaysUntilReset();

  // Calculate statistics
  const totalValue = tokensToD ollars(tierInfo.tokens + bonusTokens);
  const usedValue = tokensToD ollars(usedTokens);
  const remainingValue = tokensToD ollars(remainingTokens);

  const imagesCreated = Math.floor(usedTokens / TOKEN_COSTS.IMAGE_TRANSFORM);
  const videosCreated = Math.floor((usedTokens % TOKEN_COSTS.IMAGE_TRANSFORM) / TOKEN_COSTS.VIDEO_GENERATION);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-600/30">
        {/* Header */}
        <div className="sticky top-0 bg-black/50 backdrop-blur-md p-6 border-b border-purple-600/30">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Token Dashboard
              </h2>
              <p className="text-purple-300 mt-1">
                {tierInfo.name} Plan - {tier === 'free' ? 'Lifetime' : 'Monthly'} Tokens
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-purple-400 hover:text-purple-300 transition-colors p-2"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {['overview', 'history', 'purchase'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
                }`}
              >
                {tab === 'overview' && '📈 Overview'}
                {tab === 'history' && '📜 History'}
                {tab === 'purchase' && '🛒 Buy Tokens'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Token Counter */}
              <TokenCounter tier={tier} onPurchaseTokens={() => setActiveTab('purchase')} />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-purple-600/20">
                  <p className="text-purple-400 text-sm mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
                  <p className="text-purple-500 text-xs mt-1">
                    {formatTokensDisplay(tierInfo.tokens + bonusTokens)}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-purple-600/20">
                  <p className="text-purple-400 text-sm mb-1">Used This Period</p>
                  <p className="text-2xl font-bold text-white">${usedValue.toFixed(2)}</p>
                  <p className="text-purple-500 text-xs mt-1">
                    {formatTokensDisplay(usedTokens)}
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-purple-600/20">
                  <p className="text-purple-400 text-sm mb-1">Remaining Value</p>
                  <p className="text-2xl font-bold text-white">${remainingValue.toFixed(2)}</p>
                  <p className="text-purple-500 text-xs mt-1">
                    {formatTokensDisplay(remainingTokens)}
                  </p>
                </div>
              </div>

              {/* Usage Breakdown */}
              <div className="bg-black/30 rounded-xl p-6 border border-purple-600/20">
                <h3 className="text-xl font-bold text-white mb-4">Usage Breakdown</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-purple-400 text-sm mb-2">Creations This Period</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-xl">🎃</span> Images
                        </span>
                        <span className="text-white font-bold">{imagesCreated}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-xl">🎬</span> Videos
                        </span>
                        <span className="text-white font-bold">{videosCreated}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-purple-400 text-sm mb-2">Token Economics</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">Avg per day</span>
                        <span className="text-white font-bold">
                          {Math.round(usedTokens / Math.max(1, 30 - daysUntilReset))} tokens
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">Efficiency</span>
                        <span className="text-white font-bold">
                          {((usedTokens / tierInfo.tokens) * 100).toFixed(0)}% used
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Prompt for Free Users */}
              {tier === 'free' && remainingTokens < 100 && (
                <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Ready for More?</h3>
                      <p className="text-purple-300">
                        Upgrade to a paid plan for monthly token refresh and more features!
                      </p>
                    </div>
                    {onUpgrade && (
                      <button
                        onClick={onUpgrade}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold rounded-lg transition-all duration-300"
                      >
                        View Plans
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-6 border border-purple-600/20">
                <h3 className="text-xl font-bold text-white mb-4">Usage History</h3>
                {usageHistory.length > 0 ? (
                  <div className="space-y-2">
                    {usageHistory.slice(0, 10).map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-black/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {item.action === 'image' ? '🎃' : '🎬'}
                          </span>
                          <div>
                            <p className="text-white font-semibold">
                              {item.action === 'image' ? 'Image Transform' : 'Video Generation'}
                            </p>
                            <p className="text-purple-400 text-xs">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">-{item.tokensUsed} tokens</p>
                          <p className="text-purple-500 text-xs">
                            {item.remainingTokens} remaining
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-purple-400">No usage history yet</p>
                    <p className="text-purple-500 text-sm mt-2">
                      Start creating to see your history here!
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-xl p-4 border border-purple-600/20">
                  <p className="text-purple-400 text-sm mb-1">Most Used</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🎃</span> Images
                  </p>
                  <p className="text-purple-500 text-xs mt-1">
                    {imagesCreated} created this period
                  </p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 border border-purple-600/20">
                  <p className="text-purple-400 text-sm mb-1">Premium Features</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🎬</span> Videos
                  </p>
                  <p className="text-purple-500 text-xs mt-1">
                    {videosCreated} created this period
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchase' && (
            <TokenPacks onClose={() => setActiveTab('overview')} />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black/50 backdrop-blur-md p-4 border-t border-purple-600/30">
          <div className="flex justify-between items-center text-sm text-purple-400">
            <p>
              {tier !== 'free' && `Next renewal: ${daysUntilReset} days`}
              {tier === 'free' && 'No renewal - lifetime tokens'}
            </p>
            <p>Current summary: {getUsageSummary(tier)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDashboard;