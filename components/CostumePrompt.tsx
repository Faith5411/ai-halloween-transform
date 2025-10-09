
import React from 'react';
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

const CostumeSelector: React.FC<CostumeSelectorProps> = ({ onSelectNightmare, customPrompt, setCustomPrompt, selectedNightmare, isLoading, tier }) => {
  const isCustomPromptDisabled = isLoading || tier === 'basic';

  return (
    <div className="bg-black/20 p-6 rounded-xl card-glow-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <NightmareIcon className="w-6 h-6 text-purple-400" />
            Choose Your Nightmare
          </h2>
          <div className="overflow-x-auto py-2 -mx-2 px-2 custom-scrollbar">
            <div className="flex items-start gap-3 pb-2">
              {NIGHTMARE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSelectNightmare(option)}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-200 flex-shrink-0 w-24 text-center ${selectedNightmare?.id === option.id ? 'border-orange-500 bg-orange-500/10' : 'border-transparent'}`}
                >
                  <span className="text-4xl bg-black/20 p-2 rounded-md">{option.emoji}</span>
                  <span className="mt-1 text-xs font-bold text-white whitespace-nowrap">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-4">Or Create Your Own</h3>
          <textarea
            className="w-full h-32 bg-black/30 border-2 border-purple-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., A pirate captain made of coral, standing on a ghostly ship..."
            disabled={isCustomPromptDisabled}
          />
          {isCustomPromptDisabled && tier === 'basic' && (
            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-center p-4">
              <p className="text-white font-semibold">
                Upgrade to the <span className="text-purple-400">Pro</span> or <span className="text-green-400">Magic</span> plan to create custom transformations!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostumeSelector;
