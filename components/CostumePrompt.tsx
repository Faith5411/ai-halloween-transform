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
  const isCustomPromptDisabled = isLoading || tier === 'basic';
  const [showTips, setShowTips] = useState(false);

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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
            <NightmareIcon className='w-6 h-6 text-purple-400' />
            Choose Your Nightmare
          </h2>
          <div className='overflow-x-auto py-2 -mx-2 px-2 custom-scrollbar'>
            <div className='flex items-start gap-3 pb-2'>
              {NIGHTMARE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => onSelectNightmare(option)}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-200 flex-shrink-0 w-24 text-center ${selectedNightmare?.id === option.id ? 'border-orange-500 bg-orange-500/10' : 'border-transparent'}`}
                >
                  <span className='text-4xl bg-black/20 p-2 rounded-md'>
                    {option.emoji}
                  </span>
                  <span className='mt-1 text-xs font-bold text-white whitespace-nowrap'>
                    {option.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='relative'>
          <h3 className='text-xl font-bold text-white mb-4'>
            Or Create Your Own
          </h3>
          <textarea
            className='w-full h-32 bg-black/30 border-2 border-purple-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed'
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder='e.g., A pirate captain made of coral, standing on a ghostly ship...'
            disabled={isCustomPromptDisabled}
          />
          {isCustomPromptDisabled && tier === 'basic' && (
            <div className='absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-center p-4'>
              <p className='text-white font-semibold'>
                Upgrade to the <span className='text-purple-400'>Pro</span> or{' '}
                <span className='text-green-400'>Magic</span> plan to create
                custom transformations!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostumeSelector;
