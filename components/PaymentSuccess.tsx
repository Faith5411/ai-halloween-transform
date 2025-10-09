import React from 'react';
import type { Tier } from '../types';

interface PaymentSuccessProps {
  onClose: () => void;
  tier: Tier;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  onClose,
  tier,
}) => {
  const tierNames = {
    basic: 'Basic',
    pro: 'Pro',
    magic: 'Magic',
  };

  const tierPrices = {
    basic: '$4.99',
    pro: '$14.99',
    magic: '$29.99',
  };
  return (
    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
      <div className='bg-gradient-to-br from-purple-900 to-black p-8 rounded-2xl max-w-md text-center border-2 border-green-400'>
        <div className='text-6xl mb-4'>🎉</div>
        <h2 className='text-3xl font-bold text-white mb-4'>
          Welcome to {tierNames[tier]} Plan! 🎃
        </h2>
        <p className='text-green-300 text-lg mb-2'>
          <strong>{tierPrices[tier]}/month</strong> subscription activated!
        </p>
        <p className='text-green-300 text-lg mb-6'>
          Start transforming photos with all your{' '}
          {tier === 'magic' ? 'premium' : 'amazing'} features.
        </p>
        <button
          onClick={onClose}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors'
        >
          Start Creating! 🎃
        </button>
      </div>
    </div>
  );
};

interface PaymentCanceledProps {
  onClose: () => void;
}

export const PaymentCanceled: React.FC<PaymentCanceledProps> = ({
  onClose,
}) => {
  return (
    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
      <div className='bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md text-center border-2 border-gray-600'>
        <div className='text-6xl mb-4'>😔</div>
        <h2 className='text-3xl font-bold text-white mb-4'>Payment Canceled</h2>
        <p className='text-gray-300 text-lg mb-6'>
          No worries! You can subscribe anytime. Your data is safe.
        </p>
        <button
          onClick={onClose}
          className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors'
        >
          Back to App
        </button>
      </div>
    </div>
  );
};
