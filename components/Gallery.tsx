import React, { useState, useEffect } from 'react';
import {
  fetchGalleryItems,
  voteOnItem,
  checkUserVoted,
  removeVote,
  incrementViews,
  getCurrentContest,
  getGalleryStats,
  type GalleryItem,
  type WeeklyContest,
} from '../services/galleryService';
import { useAuth } from '../contexts/AuthContext';

interface GalleryProps {
  onClose?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'trending' | 'recent' | 'winners' | 'contest'>('contest');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());
  const [contest, setContest] = useState<WeeklyContest | null>(null);
  const [stats, setStats] = useState({
    totalTransformations: 0,
    totalVotes: 0,
    totalWinners: 0,
    totalUsers: 0,
  });

  // Load gallery items
  useEffect(() => {
    loadGallery();
  }, [filter]);

  // Load contest info and stats
  useEffect(() => {
    loadContestInfo();
    loadStats();
  }, []);

  // Check voted status for visible items
  useEffect(() => {
    if (items.length > 0) {
      checkVotedStatus();
    }
  }, [items, user]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await fetchGalleryItems(filter, 50);
      setItems(data);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContestInfo = async () => {
    const contestData = await getCurrentContest();
    setContest(contestData);
  };

  const loadStats = async () => {
    const statsData = await getGalleryStats();
    setStats(statsData);
  };

  const checkVotedStatus = async () => {
    const voted = new Set<string>();
    for (const item of items) {
      const hasVoted = await checkUserVoted(
        item.id,
        user?.id,
        undefined // Could add IP tracking here
      );
      if (hasVoted) {
        voted.add(item.id);
      }
    }
    setVotedItems(voted);
  };

  const handleVote = async (item: GalleryItem) => {
    const hasVoted = votedItems.has(item.id);

    try {
      if (hasVoted) {
        // Remove vote
        const result = await removeVote(item.id, user?.id);
        if (result.success) {
          setVotedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
          // Update local count
          setItems(prev =>
            prev.map(i =>
              i.id === item.id ? { ...i, votes_count: i.votes_count - 1 } : i
            )
          );
        }
      } else {
        // Add vote
        const result = await voteOnItem(item.id, user?.id);
        if (result.success) {
          setVotedItems(prev => new Set(prev).add(item.id));
          // Update local count
          setItems(prev =>
            prev.map(i =>
              i.id === item.id ? { ...i, votes_count: i.votes_count + 1 } : i
            )
          );
        } else if (result.error === 'Already voted') {
          setVotedItems(prev => new Set(prev).add(item.id));
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
    incrementViews(item.id);
  };

  const filterButtons = [
    { value: 'contest', label: '🏆 Contest', icon: '🎃' },
    { value: 'trending', label: '🔥 Trending', icon: '🔥' },
    { value: 'recent', label: '🆕 Recent', icon: '✨' },
    { value: 'winners', label: '👑 Winners', icon: '👑' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-950 via-black to-orange-950 overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/90 to-orange-900/90 backdrop-blur-sm border-b-2 border-orange-500 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              🎃 Halloween Gallery
            </h1>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-4xl transition-colors"
              >
                ×
              </button>
            )}
          </div>

          {/* Contest Banner */}
          {contest && filter === 'contest' && (
            <div className="bg-gradient-to-r from-green-600/30 to-teal-600/30 border-2 border-green-400 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-1">
                    🏆 Weekly Contest - {contest.contest_week}
                  </h3>
                  <p className="text-green-200 text-sm">
                    <strong>Prizes:</strong> 5 Pro Memberships + $50, $100, $200 Cash!
                  </p>
                  <p className="text-green-300 text-xs font-bold mt-1">
                    🎃 Halloween Night Grand Prize: $500! 🎃
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{contest.total_entries}</div>
                  <div className="text-sm text-green-300">Entries</div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalTransformations}</div>
              <div className="text-xs text-purple-300">Transformations</div>
            </div>
            <div className="bg-orange-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalVotes}</div>
              <div className="text-xs text-orange-300">Total Votes</div>
            </div>
            <div className="bg-green-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalWinners}</div>
              <div className="text-xs text-green-300">Winners</div>
            </div>
            <div className="bg-blue-900/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <div className="text-xs text-blue-300">Artists</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  filter === btn.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60'
                }`}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="overflow-y-auto h-[calc(100vh-300px)] md:h-[calc(100vh-280px)]">
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎃</div>
              <div className="text-xl text-purple-300">Loading gallery...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👻</div>
              <div className="text-xl text-gray-400">No transformations yet</div>
              <p className="text-gray-500 mt-2">Be the first to share your creation!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(item => {
                const hasVoted = votedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-black/40 border-2 border-purple-500/50 rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                    onClick={() => handleViewItem(item)}
                  >
                    {/* Image - Show Before/After if available */}
                    <div className="relative aspect-square">
                      {item.before_image_url ? (
                        <div className="relative w-full h-full">
                          {/* Before Image (left half) */}
                          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                            <img
                              src={item.before_image_url}
                              alt="Before transformation"
                              className="h-full w-[200%] object-cover object-left"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
                              BEFORE
                            </div>
                          </div>
                          {/* After Image (right half) */}
                          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                            <img
                              src={item.thumbnail_url || item.image_url}
                              alt={item.costume_name || 'After transformation'}
                              className="h-full w-[200%] object-cover object-right"
                            />
                            <div className="absolute top-2 right-2 bg-orange-500/70 text-white text-xs px-2 py-1 rounded font-bold">
                              AFTER
                            </div>
                          </div>
                          {/* Divider Line */}
                          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 via-orange-500 to-purple-500 opacity-60" />
                          {/* Badges */}
                          {item.is_video && (
                            <div className="absolute bottom-2 right-2 bg-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                              🎬 VIDEO
                            </div>
                          )}
                          {item.is_winner && (
                            <div className="absolute bottom-2 left-2 bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold text-black">
                              👑 WINNER
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <img
                            src={item.thumbnail_url || item.image_url}
                            alt={item.costume_name || 'Transformation'}
                            className="w-full h-full object-cover"
                          />
                          {item.is_video && (
                            <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                              🎬 VIDEO
                            </div>
                          )}
                          {item.is_winner && (
                            <div className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold text-black">
                              👑 WINNER
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg mb-2 truncate">
                        {item.costume_name || 'Spooky Transform'}
                      </h3>

                      {/* Vote Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(item);
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                          hasVoted
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                            : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'
                        }`}
                      >
                        <span className="text-xl">{hasVoted ? '🎃' : '👻'}</span>
                        <span>{hasVoted ? 'Voted' : 'Vote'}</span>
                        <span className="font-bold">({item.votes_count})</span>
                      </button>

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                        <span>👁️ {item.views_count} views</span>
                        <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900 to-black border-2 border-orange-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="float-right text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>

              {/* Before/After Images */}
              {selectedItem.before_image_url ? (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-orange-300 mb-3 text-center">
                    ✨ Before & After Transformation ✨
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-center text-purple-300 font-bold mb-2">BEFORE</div>
                      <img
                        src={selectedItem.before_image_url}
                        alt="Before transformation"
                        className="w-full rounded-xl border-2 border-purple-500"
                      />
                    </div>
                    <div>
                      <div className="text-center text-orange-300 font-bold mb-2">AFTER</div>
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.costume_name || 'After transformation'}
                        className="w-full rounded-xl border-2 border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.costume_name || 'Transformation'}
                  className="w-full rounded-xl mb-4"
                />
              )}

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedItem.costume_name || 'Spooky Transform'}
              </h2>

              {/* Prompt */}
              {selectedItem.prompt && (
                <p className="text-gray-300 italic mb-4">"{selectedItem.prompt}"</p>
              )}

              {/* Vote Button */}
              <button
                onClick={() => handleVote(selectedItem)}
                className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all ${
                  votedItems.has(selectedItem.id)
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                }`}
              >
                {votedItems.has(selectedItem.id) ? '🎃 Voted' : '👻 Vote for this!'}{' '}
                ({selectedItem.votes_count} votes)
              </button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">
                    {selectedItem.votes_count}
                  </div>
                  <div className="text-xs text-purple-300">Votes</div>
                </div>
                <div className="bg-orange-900/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">
                    {selectedItem.views_count}
                  </div>
                  <div className="text-xs text-orange-300">Views</div>
                </div>
                <div className="bg-green-900/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-300">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
