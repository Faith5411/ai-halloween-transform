import React, { useState } from 'react';
import { PumpkinIcon, GhostIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  onShowGallery?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowGallery }) => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className='text-center relative'>
        {/* Auth Button - Top Right */}
        <div className='absolute top-0 right-0'>
          {user ? (
            <div className='flex items-center gap-3'>
              <span className='text-purple-300 text-sm hidden sm:inline'>
                👻 {user.email?.split('@')[0] || 'User'}
              </span>
              {/* Gallery Button */}
              {onShowGallery && (
                <button
                  type="button"
                  onClick={onShowGallery}
                  className='px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
                >
                  🏆 Gallery
                </button>
              )}
              <button
                type="button"
                onClick={() => signOut()}
                className='px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className='px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            >
              Sign In
            </button>
          )}
        </div>

        <div className='flex justify-center items-center gap-4'>
          <PumpkinIcon className='w-10 h-10 text-orange-400' />
          <GhostIcon className='w-10 h-10 text-purple-400' />
          <h1 className='text-4xl md:text-6xl font-creepster text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 tracking-wider'>
            AI Halloween Transform
          </h1>
          <GhostIcon className='w-10 h-10 text-purple-400' />
          <PumpkinIcon className='w-10 h-10 text-orange-400' />
        </div>
        <p className='mt-2 text-lg md:text-xl text-purple-300'>
          In loving memory of <span className="text-orange-300">Dakota Lee Crandall</span>✨
        </p>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
