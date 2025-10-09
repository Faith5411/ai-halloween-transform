import React from 'react';

export const PaymentSuccess: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black p-8 rounded-2xl max-w-md text-center border-2 border-green-400">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Welcome to AI Halloween!
        </h2>
        <p className="text-green-300 text-lg mb-6">
          Your subscription is now active! Start transforming photos with all your new features.
        </p>
        <button
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Start Creating! 🎃
        </button>
      </div>
    </div>
  );
};

export const PaymentCanceled: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md text-center border-2 border-gray-600">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Payment Canceled
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          No worries! You can subscribe anytime. Your data is safe.
        </p>
        <button
          onClick={() => {
            window.location.href = window.location.pathname;
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Back to App
        </button>
      </div>
    </div>
  );
};
