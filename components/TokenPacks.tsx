import React, { useState } from 'react';
import { TOKEN_PACKS } from '../constants/credits';
import { addBonusTokens } from '../services/usageService';

interface TokenPackProps {
  onPurchase?: (packId: string, tokens: number, price: number) => void;
  onClose?: () => void;
}

const TokenPacks: React.FC<TokenPackProps> = ({ onPurchase, onClose }) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async (packId: string, tokens: number, price: number) => {
    setIsPurchasing(true);
    setSelectedPack(packId);

    try {
      // In production, this would redirect to Stripe checkout
      // For now, we'll simulate the purchase
      if (onPurchase) {
        onPurchase(packId, tokens, price);
      } else {
        // Simulate Stripe redirect
        alert(`🛒 Redirecting to checkout for ${tokens} tokens ($${price})...`);

        // In real implementation:
        // window.location.href = `stripe_checkout_url_for_${packId}`;

        // For demo, just add the tokens
        setTimeout(() => {
          addBonusTokens(tokens);
          alert(`✅ Successfully purchased ${tokens} tokens!`);
          if (onClose) onClose();
        }, 1000);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('❌ Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
      setSelectedPack(null);
    }
  };

  const packs = [
    {
      id: 'small',
      ...TOKEN_PACKS.small,
      icon: '🎃',
      name: 'Starter Pack',
      description: '7 images or mix with video',
      popular: false,
    },
    {
      id: 'medium',
      ...TOKEN_PACKS.medium,
      icon: '👻',
      name: 'Popular Pack',
      description: '20 images or 2 videos',
      popular: true,
    },
    {
      id: 'large',
      ...TOKEN_PACKS.large,
      icon: '🧙‍♀️',
      name: 'Magic Pack',
      description: '40 images or 4 videos',
      popular: false,
    },
  ];

  return (
    <div className="bg-black/90 backdrop-blur-md rounded-xl p-6 border border-purple-600/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🛒</span>
            Token Packs
          </h2>
          <p className="text-purple-300 text-sm mt-1">
            One-time purchases that never expire
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Token Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`relative bg-black/40 rounded-xl p-6 border-2 transition-all duration-300 ${
              selectedPack === pack.id
                ? 'border-purple-500 transform scale-105'
                : 'border-purple-600/30 hover:border-purple-600/50'
            } ${pack.popular ? 'ring-2 ring-purple-500/30' : ''}`}
          >
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{pack.icon}</div>
              <h3 className="text-xl font-bold text-white">{pack.name}</h3>
              <p className="text-purple-300 text-sm mt-1">{pack.description}</p>
            </div>

            <div className="mb-4">
              <p className="text-4xl font-bold text-white text-center">
                {pack.tokens.toLocaleString()}
              </p>
              <p className="text-purple-400 text-center text-sm">tokens</p>
            </div>

            <div className="mb-4 p-3 bg-purple-900/20 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-300">Price:</span>
                <span className="text-white font-semibold">${pack.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Value:</span>
                <span className="text-green-400 font-semibold">
                  ${(pack.tokens / 250).toFixed(2)}
                </span>
              </div>
              {pack.savings !== '0%' && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-300">Savings:</span>
                  <span className="text-yellow-400 font-semibold">{pack.savings}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handlePurchase(pack.id, pack.tokens, pack.price)}
              disabled={isPurchasing && selectedPack === pack.id}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                isPurchasing && selectedPack === pack.id
                  ? 'bg-purple-800 cursor-not-allowed opacity-50'
                  : pack.popular
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isPurchasing && selectedPack === pack.id ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Buy ${pack.tokens} Tokens`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/20">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span>
          About Token Packs
        </h3>
        <ul className="space-y-2 text-sm text-purple-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Tokens never expire - use them anytime</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Mix and match - use for images or videos</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>Stack with monthly tokens from subscriptions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <span>$1 = 250 tokens base rate</span>
          </li>
        </ul>
      </div>

      {/* Token Cost Reference */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-purple-400 text-xs mb-1">Image Transform</p>
          <p className="text-white font-bold">100 tokens</p>
          <p className="text-purple-500 text-xs">$0.40 value</p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-purple-400 text-xs mb-1">Video Generation</p>
          <p className="text-white font-bold">1,000 tokens</p>
          <p className="text-purple-500 text-xs">$4.00 value</p>
        </div>
      </div>
    </div>
  );
};

export default TokenPacks;