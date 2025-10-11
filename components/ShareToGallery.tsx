import React, { useState } from 'react';
import {
  submitToGallery,
  getCurrentContestWeek,
} from '../services/galleryService';
import { getCurrentUser } from '../services/authService';

interface ShareToGalleryProps {
  imageUrl: string;
  costumeName?: string;
  prompt?: string;
  isVideo?: boolean;
  thumbnailUrl?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ShareToGallery: React.FC<ShareToGalleryProps> = ({
  imageUrl,
  costumeName,
  prompt,
  isVideo = false,
  thumbnailUrl,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contestWeek, setContestWeek] = useState<string>('');

  React.useEffect(() => {
    const loadContestWeek = async () => {
      const week = await getCurrentContestWeek();
      setContestWeek(week);
    };
    loadContestWeek();
  }, []);

  const handleShare = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        setError('You must be logged in to share to the gallery');
        setLoading(false);
        return;
      }

      // Submit to gallery
      const result = await submitToGallery(
        user.id,
        user.email || 'Anonymous',
        imageUrl,
        costumeName || 'Spooky Transform',
        prompt,
        isVideo,
        thumbnailUrl
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to share to gallery');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
      <div className='bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400'>
            🎃 Share to Gallery
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white text-3xl transition-colors'
            disabled={loading}
          >
            ×
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className='text-center py-12'>
            <div className='text-7xl mb-4'>🎉</div>
            <h3 className='text-3xl font-bold text-green-400 mb-3'>
              Shared Successfully!
            </h3>
            <p className='text-xl text-gray-300 mb-2'>
              Your transformation is now in the public gallery!
            </p>
            <p className='text-lg text-purple-300'>
              Get votes to win this week's contest! 🏆
            </p>
          </div>
        ) : (
          <>
            {/* Contest Info Banner */}
            <div className='bg-gradient-to-r from-green-600/20 to-teal-600/20 border-2 border-green-400 rounded-xl p-4 mb-6'>
              <div className='flex items-center gap-3 mb-2'>
                <span className='text-3xl'>🏆</span>
                <h3 className='text-xl font-bold text-green-400'>
                  Enter Weekly Contest!
                </h3>
              </div>
              <p className='text-green-200 text-sm mb-2'>
                <strong>Weekly Prizes:</strong> 5 Pro Memberships + $50, $100,
                $200 Cash!
              </p>
              <p className='text-green-300 text-xs font-bold'>
                🎃 Halloween Night: $500 GRAND PRIZE for Best Photo/Video! 🎃
              </p>
              {contestWeek && (
                <p className='text-green-300 text-xs mt-1'>
                  Contest Week: {contestWeek}
                </p>
              )}
            </div>

            {/* Preview */}
            <div className='mb-6'>
              <h3 className='text-xl font-bold text-white mb-3'>Preview:</h3>
              <div className='bg-black/40 border border-purple-500/50 rounded-xl overflow-hidden'>
                <img
                  src={thumbnailUrl || imageUrl}
                  alt={costumeName || 'Transformation'}
                  className='w-full h-64 object-cover'
                />
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-bold text-white text-lg'>
                      {costumeName || 'Spooky Transform'}
                    </h4>
                    {isVideo && (
                      <span className='bg-purple-600 px-3 py-1 rounded-full text-sm font-bold'>
                        🎬 VIDEO
                      </span>
                    )}
                  </div>
                  {prompt && (
                    <p className='text-gray-400 text-sm italic line-clamp-2'>
                      "{prompt}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className='bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 mb-6'>
              <h3 className='text-lg font-bold text-purple-300 mb-3 flex items-center gap-2'>
                <span>ℹ️</span> What happens when you share:
              </h3>
              <ul className='space-y-2 text-sm text-gray-300'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-400'>✓</span>
                  <span>Your transformation appears in the public gallery</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-400'>✓</span>
                  <span>Anyone can vote on your creation</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-400'>✓</span>
                  <span>Automatically entered into this week's contest</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-400'>✓</span>
                  <span>Win FREE membership if you get the most votes!</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-orange-400'>⚠</span>
                  <span>Your creation will be publicly visible</span>
                </li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className='bg-red-900/30 border border-red-500 rounded-xl p-4 mb-6'>
                <p className='text-red-300 flex items-center gap-2'>
                  <span>❌</span>
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className='flex gap-4'>
              <button
                onClick={onClose}
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <span>🎃</span>
                    <span>Share to Gallery</span>
                  </>
                )}
              </button>
            </div>

            {/* Terms */}
            <p className='text-xs text-gray-500 text-center mt-4'>
              By sharing, you agree that your transformation may be displayed
              publicly and used for promotional purposes. You retain all rights
              to your original content.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareToGallery;
