import React from 'react';
import { TRANSFORM_PACK_LINKS } from '../constants-stripe';

interface BuyMoreTransformsProps {
  remainingTransforms: number;
  tier: 'free' | 'basic' | 'pro' | 'magic';
  onClose?: () => void;
}

const BuyMoreTransforms: React.FC<BuyMoreTransformsProps> = ({
  remainingTransforms,
  tier,
  onClose,
}) => {
  const handleBuyPack = (packKey: 'pack5' | 'pack10' | 'pack25') => {
    const pack = TRANSFORM_PACK_LINKS[packKey];
    window.location.href = pack.url;
  };

  const packs = [
    {
      key: 'pack5' as const,
      ...TRANSFORM_PACK_LINKS.pack5,
      badge: 'Quick Boost',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'from-orange-600 to-red-600',
    },
    {
      key: 'pack10' as const,
      ...TRANSFORM_PACK_LINKS.pack10,
      badge: 'Most Popular',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'from-purple-600 to-pink-600',
    },
    {
      key: 'pack25' as const,
      ...TRANSFORM_PACK_LINKS.pack25,
      badge: 'Best Value',
      color: 'from-green-500 to-teal-500',
      hoverColor: 'from-green-600 to-teal-600',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-purple-900/95 via-black/95 to-orange-900/95 border-2 border-orange-500 rounded-2xl max-w-4xl w-full p-8 relative shadow-2xl shadow-orange-500/20">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎃💰</div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-2">
            Need More Transforms?
          </h2>
          <p className="text-gray-300 text-lg">
            {remainingTransforms === 0 ? (
              <>You've used all your monthly transforms! Get more instantly.</>
            ) : (
              <>
                Only <span className="font-bold text-orange-400">{remainingTransforms}</span> left!
                Stock up now.
              </>
            )}
          </p>
        </div>

        {/* Transform Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {packs.map((pack) => (
            <div
              key={pack.key}
              className="relative bg-black/40 border-2 border-purple-500/50 rounded-xl p-6 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className={`px-3 py-1 bg-gradient-to-r ${pack.color} text-white text-xs font-bold rounded-full shadow-lg`}>
                  {pack.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="text-5xl text-center mb-4 mt-2">
                {pack.key === 'pack5' && '🎨'}
                {pack.key === 'pack10' && '✨'}
                {pack.key === 'pack25' && '🚀'}
              </div>

              {/* Details */}
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-white mb-1">
                  {pack.transforms}
                </div>
                <div className="text-gray-400 text-sm mb-3">Transforms</div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                  {pack.price}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${(pack.priceValue / pack.transforms).toFixed(2)} per transform
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handleBuyPack(pack.key)}
                className={`w-full py-3 px-4 bg-gradient-to-r ${pack.color} hover:${pack.hoverColor} text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              >
                Buy Now 🎃
              </button>

              {/* Value indicator */}
              {pack.key === 'pack25' && (
                <div className="mt-3 text-center text-green-400 text-sm font-semibold">
                  💚 Save 33%!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
            <span>✨</span>
            <span className="font-semibold">Bonus transforms never expire!</span>
            <span>✨</span>
          </div>
          <p className="text-xs text-gray-400">
            Use them anytime, even after your monthly limit resets. Perfect for special occasions!
          </p>
        </div>

        {/* Alternative: Upgrade */}
        {(tier === 'free' || tier === 'basic') && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Or upgrade to get more transforms every month:
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {tier === 'free' && (
                <span className="text-sm text-orange-300">
                  <strong>Basic:</strong> 10/month for $4.99
                </span>
              )}
              <span className="text-sm text-purple-300">
                <strong>Pro:</strong> 30/month for $14.99
              </span>
              <span className="text-sm text-green-300">
                <strong>Magic:</strong> 30/month + videos for $29.99
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Secure payment powered by Stripe 🔒
        </div>
      </div>
    </div>
  );
};

export default BuyMoreTransforms;
