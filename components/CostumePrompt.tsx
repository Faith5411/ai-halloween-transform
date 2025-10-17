import React, { useState } from 'react';
import { NIGHTMARE_OPTIONS } from '../constants';
import type { NightmareOption, Tier } from '../types';
import { NightmareIcon } from './Icons';

interface CostumeSelectorProps {
  selectedNightmare: NightmareOption | null;
  onSelectNightmare: (nightmare: NightmareOption) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isLoading: boolean;
  tier: Tier;
}

const CostumeSelector: React.FC<CostumeSelectorProps> = ({
  onSelectNightmare,
  customPrompt,
  setCustomPrompt,
  selectedNightmare,
  isLoading,
  tier,
}) => {
  const isCustomPromptDisabled = isLoading || tier === 'free' || tier === 'basic';
  const [showTips, setShowTips] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  return (
    <div className='bg-black/20 p-6 rounded-xl card-glow-border'>
      {/* READ ME Tips Section */}
      <div className='mb-6'>
        <button
          onClick={() => setShowTips(!showTips)}
          className='w-full flex items-center justify-between bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-blue-400 rounded-lg p-4 hover:border-blue-300 transition-all'
        >
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>📖</span>
            <h3 className='text-xl font-bold text-blue-300'>
              READ ME - Tips for Better Results
            </h3>
          </div>
          <span className='text-2xl text-blue-300'>
            {showTips ? '▼' : '▶'}
          </span>
        </button>

        {showTips && (
          <div className='mt-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-500/30 rounded-lg p-6 space-y-4'>
            <div className='flex items-start gap-3'>
              <span className='text-2xl'>✨</span>
              <div>
                <h4 className='font-bold text-blue-200 mb-1'>
                  Be Specific and Detailed
                </h4>
                <p className='text-gray-300 text-sm'>
                  The more detailed your description, the better your
                  transformation! Instead of "zombie," try "decaying zombie with
                  glowing green eyes, torn Victorian clothing, and moss-covered
                  skin."
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <span className='text-2xl'>🎨</span>
              <div>
                <h4 className='font-bold text-blue-200 mb-1'>
                  Include Visual Details
                </h4>
                <p className='text-gray-300 text-sm'>
                  Describe colors, textures, lighting, and atmosphere. Example:
                  "vampire with pale porcelain skin, crimson eyes, wearing a
                  black velvet cloak under moonlight."
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <span className='text-2xl'>🌟</span>
              <div>
                <h4 className='font-bold text-blue-200 mb-1'>Set the Scene</h4>
                <p className='text-gray-300 text-sm'>
                  Add environment and mood details. Example: "ghostly spirit
                  emerging from fog in a haunted graveyard at midnight with
                  glowing ethereal aura."
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <span className='text-2xl'>💡</span>
              <div>
                <h4 className='font-bold text-blue-200 mb-1'>
                  Use Style Keywords
                </h4>
                <p className='text-gray-300 text-sm'>
                  Add artistic styles for unique looks: "cinematic,"
                  "hyper-realistic," "gothic," "comic book style," "oil painting
                  effect," etc.
                </p>
              </div>
            </div>

            <div className='bg-green-900/30 border border-green-500/30 rounded-lg p-4 mt-4'>
              <p className='text-green-200 text-sm font-semibold'>
                🎃 Pro Tip: Combine multiple elements for truly unique
                transformations! The AI works best with rich, descriptive
                prompts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tab Selection */}
      <div className='flex gap-2 mb-6'>
        <button
          type="button"
          onClick={() => {
            setActiveTab('presets');
            setCustomPrompt('');
          }}
          className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'presets'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
              : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60 border border-gray-700'
          }`}
        >
          <span className='text-xl'>🎃</span>
          <span>Preset Costumes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('custom');
            onSelectNightmare(null as any);
          }}
          className={`flex-1 py-3 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60 border border-gray-700'
          }`}
        >
          <span className='text-xl'>✨</span>
          <span>Custom Prompt</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'presets' ? (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-white flex items-center gap-2'>
              <NightmareIcon className='w-6 h-6 text-purple-400' />
              Choose Your Nightmare
            </h2>
            {selectedNightmare && (
              <button
                type="button"
                onClick={() => {
                  onSelectNightmare(null as any);
                }}
                disabled={isLoading}
                className='px-3 py-1 bg-red-600/20 border border-red-500 text-red-300 rounded-lg text-sm font-semibold hover:bg-red-600/30 hover:text-red-200 transition-all duration-200 flex items-center gap-1'
              >
                <span>❌</span>
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {NIGHTMARE_OPTIONS.map(option => (
              <button
                type="button"
                key={option.id}
                onClick={() => onSelectNightmare(option)}
                disabled={isLoading}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-200 ${
                  selectedNightmare?.id === option.id
                    ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20'
                    : 'border-purple-700 bg-black/30'
                }`}
              >
                <span className='text-5xl bg-black/20 p-3 rounded-lg'>
                  {option.emoji}
                </span>
                <span className='text-sm font-bold text-white'>
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className='relative'>
          <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
            <span className='text-2xl'>🎨</span>
            Create Your Own Transformation
          </h3>
          <textarea
            className='w-full h-40 bg-black/30 border-2 border-purple-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed text-lg'
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder='Describe your Halloween transformation in detail...

Example: "Transform me into a ghostly pirate captain with glowing green eyes, wearing a tattered naval coat covered in seaweed, standing on the deck of a spectral ship emerging from fog, with ethereal tentacles wrapped around the masts under a blood moon"'
            disabled={isCustomPromptDisabled}
          />
          {isCustomPromptDisabled && (tier === 'free' || tier === 'basic') && (
            <div className='absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-center p-4'>
              <p className='text-white font-semibold text-lg'>
                🔒 Upgrade to <span className='text-purple-400'>Pro</span> or{' '}
                <span className='text-green-400'>Magic</span> plan to unlock custom prompts!
              </p>
            </div>
          )}
          {!isCustomPromptDisabled && customPrompt && (
            <div className='mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3'>
              <p className='text-green-300 text-sm'>
                ✅ Your custom prompt is ready! Click "Transform" to see your unique creation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CostumeSelector;
