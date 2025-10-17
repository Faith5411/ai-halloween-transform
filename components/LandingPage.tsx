import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { getCurrentUser } from '../services/authService';
import {
  checkUserVoted,
  fetchGalleryItems,
  type GalleryItem,
  getGalleryStats,
  voteOnItem,
} from '../services/galleryService';
import {
  GhostIcon,
  LightningIcon,
  PumpkinIcon,
  WandIcon,
} from './Icons';

interface LandingPageProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [activeTab, setActiveTab] = useState<'slideshow' | 'gallery'>(
    'slideshow'
  );
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [stats, setStats] = useState({
    totalTransformations: 0,
    totalVotes: 0,
    totalWinners: 0,
    totalUsers: 0,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioNeedsInteraction, setAudioNeedsInteraction] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Get current user
  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setUserId(user?.id || null);
      setIsSignedIn(!!user);
    };
    loadUser();
  }, []);

  // Fetch gallery stats
  useEffect(() => {
    const loadStats = async () => {
      const realStats = await getGalleryStats();
      setStats(realStats);
    };
    loadStats();
  }, []);

  // Loop spooky audio on landing. Falls back to user prompt if autoplay is blocked.
  useEffect(() => {
    const audio = new Audio('/audio/deep-voice-intro.wav');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    let isCancelled = false;

    const tryPlay = async () => {
      try {
        await audio.play();
        if (!isCancelled) {
          setIsAudioPlaying(true);
          setAudioNeedsInteraction(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Autoplay blocked for landing audio:', err);
          setAudioNeedsInteraction(true);
        }
      }
    };

    void tryPlay();

    return () => {
      isCancelled = true;
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsAudioPlaying(true);
        setAudioNeedsInteraction(false);
      } catch (err) {
        console.error('Unable to resume landing audio:', err);
        setAudioNeedsInteraction(true);
      }
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  // Fetch gallery items
  useEffect(() => {
    const loadGalleryItems = async () => {
      setLoading(true);
      const items = await fetchGalleryItems('trending', 50, 0);
      setGalleryItems(items);
      setLoading(false);

      // Check which items user has voted on
      if (userId) {
        const voted = new Set<string>();
        for (const item of items) {
          const hasVoted = await checkUserVoted(item.id, userId);
          if (hasVoted) {
            voted.add(item.id);
          }
        }
        setVotedItems(voted);
      }
    };

    loadGalleryItems();
  }, [userId]);

  // Auto-advance slideshow
  useEffect(() => {
    if (activeTab !== 'slideshow' || galleryItems.length === 0) return;

    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % galleryItems.length);
        setFadeState('in');
      }, 500);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [activeTab, galleryItems.length]);

  const handleVote = async (itemId: string) => {
    if (votedItems.has(itemId)) return;

    // Get user IP for anonymous voting
    let voterIp: string | undefined;
    if (!userId) {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        voterIp = ipData.ip;
      } catch (error) {
        console.error('Error getting IP:', error);
        voterIp = 'unknown';
      }
    }

    const result = await voteOnItem(itemId, userId || undefined, voterIp);

    if (result.success) {
      setVotedItems(prev => new Set(prev).add(itemId));
      setGalleryItems(items =>
        items.map(item =>
          item.id === itemId
            ? { ...item, votes_count: item.votes_count + 1 }
            : item
        )
      );
    }
  };

  const currentItem = galleryItems[currentIndex];

  return (
    <div className='min-h-screen bg-transparent text-white relative overflow-hidden'>
      {/* Header */}
      <header className='relative z-10 pt-8 pb-4 text-center'>
        <div className='flex items-center justify-center gap-4 mb-3'>
          <PumpkinIcon className='w-12 h-12 text-orange-400 animate-bounce' />
          <h1 className='text-5xl md:text-7xl font-creepster text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-orange-400'>
            AI Halloween Transform
          </h1>
          <GhostIcon
            className='w-12 h-12 text-purple-400 animate-bounce'
            style={{ animationDelay: '0.5s' }}
          />
        </div>
        <p className='text-xl md:text-2xl text-purple-300'>
          Transform yourself using J.L.Crandall's AI magic app ✨
        </p>
        <div className='mt-4 flex justify-center'>
          <button
            type='button'
            onClick={handleToggleAudio}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              isAudioPlaying
                ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:from-purple-700 hover:to-orange-600'
                : 'bg-black/40 border border-purple-500/40 text-purple-200 hover:bg-black/60'
            }`}
          >
            {audioNeedsInteraction && !isAudioPlaying
              ? '🔊 Enable Spooky Audio'
              : isAudioPlaying
              ? '🔇 Mute Spooky Audio'
              : '🔊 Play Spooky Audio'}
          </button>
        </div>
      </header>

      {/* Contest Banner */}
      <div className='relative z-10 container mx-auto px-4 mb-6'>
        <div className='bg-gradient-to-r from-green-600/90 via-teal-600/90 to-green-600/90 border-2 border-green-400 rounded-2xl p-4 max-w-4xl mx-auto backdrop-blur-sm animate-pulse-slow shadow-2xl shadow-green-500/30'>
          <div className='flex items-center justify-center gap-3 mb-2'>
            <span className='text-3xl'>🏆</span>
            <h3 className='text-2xl font-bold text-white'>
              WEEKLY GIVEAWAY - WIN PRO MEMBERSHIPS & CASH PRIZES!
            </h3>
            <span className='text-3xl'>🏆</span>
          </div>
          <p className='text-green-200 text-center'>
            5 Pro Memberships + $50, $100, $200 Cash Prizes Every Week!
          </p>
          <p className='text-green-300 text-center font-bold mt-1'>
            🎃 Halloween Night: $500 GRAND PRIZE for Best Photo/Video! 🎃
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className='relative z-10 container mx-auto px-4 mb-6'>
        <div className='bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 max-w-4xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <div className='text-3xl font-bold text-orange-400'>
                {stats.totalTransformations.toLocaleString()}+
              </div>
              <div className='text-gray-400 text-sm'>Transformations</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-purple-400'>99</div>
              <div className='text-gray-400 text-sm'>Costumes</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-green-400'>
                {stats.totalWinners}
              </div>
              <div className='text-gray-400 text-sm'>Winners</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-pink-400'>
                {stats.totalVotes.toLocaleString()}
              </div>
              <div className='text-gray-400 text-sm'>Votes Cast</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='relative z-10 container mx-auto px-4 mb-6'>
        <div className='flex justify-center gap-4 max-w-4xl mx-auto'>
          <button
            onClick={() => setActiveTab('slideshow')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'slideshow'
                ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🎬 Live Transformations
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg shadow-orange-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🖼️ Full Gallery
          </button>
        </div>
      </div>

      {/* Main Content Area - Matches App Style */}
      <div className='relative z-10 container mx-auto px-4 py-8 max-w-7xl'>
        {activeTab === 'slideshow' ? (
          // Slideshow View (looks like app)
          <main className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            {/* Before Photo (Left) */}
            <div className='bg-black/20 p-4 rounded-xl card-glow-border h-full'>
              <h2 className='text-xl font-bold text-white mb-3 flex items-center gap-2'>
                <WandIcon className='w-6 h-6 text-orange-400' />
                Before
              </h2>
              <div className='relative w-full h-[480px] bg-black/30 rounded-lg flex items-center justify-center overflow-hidden'>
                {loading || !currentItem ? (
                  <div className='text-center text-purple-400'>
                    <div className='text-6xl mb-4'>🎃</div>
                    <p className='text-xl'>Loading transformations...</p>
                  </div>
                ) : (
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      fadeState === 'in' ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className='w-full h-full bg-gray-900 flex items-center justify-center'>
                      <div className='text-center p-8'>
                        <div className='text-8xl mb-4'>📸</div>
                        <p className='text-2xl text-gray-400'>Original Photo</p>
                        <p className='text-gray-500 mt-2'>
                          Before AI transformation
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* After Photo (Right) */}
            <div className='bg-black/20 p-4 rounded-xl card-glow-border h-full'>
              <h2 className='text-xl font-bold text-white mb-3 flex items-center gap-2'>
                <LightningIcon className='w-6 h-6 text-green-400' />
                After - AI Transformation
              </h2>
              <div className='relative w-full h-[480px] bg-black/30 rounded-lg flex items-center justify-center overflow-hidden group'>
                {loading || !currentItem ? (
                  <div className='text-center text-purple-400'>
                    <div className='text-6xl mb-4'>👻</div>
                    <p className='text-xl'>Loading transformations...</p>
                  </div>
                ) : (
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      fadeState === 'in' ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={currentItem.image_url}
                      alt={currentItem.costume_name || 'Transformation'}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

                    {/* Info Overlay */}
                    <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='text-xl font-bold text-white mb-1'>
                            {currentItem.costume_name || 'Spooky Transform'}
                          </h3>
                          {currentItem.is_winner && (
                            <span className='inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold'>
                              🏆 WINNER
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleVote(currentItem.id)}
                          disabled={votedItems.has(currentItem.id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all text-lg ${
                            votedItems.has(currentItem.id)
                              ? 'bg-pink-600 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white hover:scale-110'
                          }`}
                        >
                          <span className='text-2xl'>❤️</span>
                          <span>{currentItem.votes_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slideshow Progress */}
              {galleryItems.length > 0 && (
                <div className='mt-4 text-center text-gray-400 text-sm'>
                  Transformation {currentIndex + 1} of {galleryItems.length}
                </div>
              )}
            </div>
          </main>
        ) : (
          // Gallery View (requires sign-in)
          <div>
            {!isSignedIn ? (
              // Sign-in prompt
              <div className='text-center py-20'>
                <div className='text-8xl mb-6'>🔒</div>
                <h2 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4'>
                  Sign In to View Full Gallery
                </h2>
                <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
                  Create an account or sign in to browse all transformations,
                  vote on your favorites, and submit your own!
                </p>
                <div className='flex gap-4 justify-center'>
                  <button
                    onClick={onSignIn}
                    className='px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl font-bold rounded-xl shadow-2xl shadow-orange-500/50 transform hover:scale-105 transition-all duration-200'
                  >
                    🎃 Sign In Now
                  </button>
                  <button
                    onClick={onGetStarted}
                    className='px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-xl shadow-2xl shadow-purple-500/50 transform hover:scale-105 transition-all duration-200'
                  >
                    👻 Create Account
                  </button>
                </div>
              </div>
            ) : (
              // Gallery Grid
              <div>
                <h2 className='text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-8'>
                  🎨 All Transformations
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {galleryItems.map(item => (
                    <div
                      key={item.id}
                      className='group relative bg-gradient-to-br from-purple-900/40 to-black/40 border-2 border-purple-500/50 rounded-xl overflow-hidden hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50'
                    >
                      {/* Winner Badge */}
                      {item.is_winner && (
                        <div className='absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg'>
                          <span>🏆</span> WINNER
                        </div>
                      )}

                      {/* Image - Show Before/After if available */}
                      <div className='relative aspect-square bg-gray-900'>
                        {item.before_image_url ? (
                          <div className='relative w-full h-full'>
                            {/* Before Image (left half) */}
                            <div className='absolute inset-y-0 left-0 w-1/2 overflow-hidden'>
                              <img
                                src={item.before_image_url}
                                alt='Before transformation'
                                className='h-full w-[200%] object-cover'
                                style={{ objectPosition: 'left' }}
                                loading='lazy'
                              />
                              <div className='absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold'>
                                BEFORE
                              </div>
                            </div>
                            {/* After Image (right half) */}
                            <div className='absolute inset-y-0 right-0 w-1/2 overflow-hidden'>
                              <img
                                src={item.thumbnail_url || item.image_url}
                                alt={item.costume_name || 'After transformation'}
                                className='h-full w-[200%] object-cover'
                                style={{ objectPosition: 'right' }}
                                loading='lazy'
                              />
                              <div className='absolute top-2 right-2 bg-orange-500/70 text-white text-xs px-2 py-1 rounded font-bold'>
                                AFTER
                              </div>
                            </div>
                            {/* Divider Line */}
                            <div className='absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 via-orange-500 to-purple-500 opacity-60' />
                          </div>
                        ) : (
                          <img
                            src={item.thumbnail_url || item.image_url}
                            alt={item.costume_name || 'Transformation'}
                            className='w-full h-full object-cover'
                            loading='lazy'
                          />
                        )}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                      </div>

                      {/* Info */}
                      <div className='p-4'>
                        <h3 className='font-bold text-white mb-2 truncate'>
                          {item.costume_name || 'Spooky Transform'}
                        </h3>

                        <div className='flex items-center justify-between'>
                          <button
                            onClick={() => handleVote(item.id)}
                            disabled={votedItems.has(item.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                              votedItems.has(item.id)
                                ? 'bg-pink-600 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white hover:scale-110'
                            }`}
                          >
                            <span className='text-xl'>❤️</span>
                            <span>{item.votes_count}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className='relative z-10 py-16 px-4'>
        <div className='container mx-auto max-w-4xl text-center'>
          <h2 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-6'>
            Ready to Transform? 🎃
          </h2>
          <p className='text-xl text-gray-300 mb-8'>
            Join thousands creating spooky masterpieces with AI magic!
          </p>
          <button
            onClick={onGetStarted}
            className='px-12 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-2xl font-bold rounded-xl shadow-2xl shadow-orange-500/50 transform hover:scale-105 transition-all duration-200'
          >
            🎃 Start Creating Now - FREE!
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
