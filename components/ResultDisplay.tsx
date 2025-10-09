
import React from 'react';
import { DownloadIcon, WandIcon, AlertTriangleIcon, LightningIcon, RobotIcon } from './Icons';
import type { Tier } from '../types';

interface ResultDisplayProps {
  tier: Tier;
  result: string | null;
  isLoading: boolean;
  error: string | null;
  canTransform: boolean;
  onTransform: () => void;
  hasFile: boolean;
  videoResult: string | null;
  isVideoLoading: boolean;
  videoError: string | null;
  onCreateVideo: () => void;
}

const ImageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute inset-0 border-4 border-purple-400 rounded-full"></div>
        <div className="absolute inset-4 text-4xl animate-pulse">👻</div>
    </div>
    <p className="mt-6 text-xl font-bold text-purple-300">Casting the spell...</p>
    <p className="text-purple-400">Your spooky transformation is brewing.</p>
  </div>
);

const VideoLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute inset-0 border-4 border-green-400 rounded-full"></div>
        <div className="absolute inset-4 text-4xl animate-pulse">🤖</div>
    </div>
    <p className="mt-6 text-xl font-bold text-green-300">Animating your creation...</p>
    <p className="text-green-400 max-w-xs">This may take a few minutes. The spirits are working their magic!</p>
  </div>
);

const Placeholder: React.FC<{ hasFile: boolean }> = ({ hasFile }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-purple-400 p-4">
        <div className="w-24 h-24 bg-gray-900/50 rounded-full flex items-center justify-center border-2 border-purple-800 mb-4">
            <WandIcon className="w-12 h-12 text-purple-500"/>
        </div>
        <h3 className="text-xl font-bold text-white">
            {hasFile ? 'Select a Nightmare' : 'Upload Photo First'}
        </h3>
        <p className="text-purple-300/80">
            {hasFile ? 'Choose a costume to begin' : 'Upload a photo to get started'}
        </p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-300 p-4">
        <AlertTriangleIcon className="w-16 h-16 text-red-500 mb-4"/>
        <h3 className="text-xl font-bold">Oh, Spooks!</h3>
        <p className="mt-2 max-w-sm">{message}</p>
    </div>
);

const TransformButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <button 
            onClick={onClick}
            className="group relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 hover:scale-105 transition-transform duration-300"
        >
            <div className="absolute inset-0 bg-black/20 rounded-full group-hover:opacity-0 transition-opacity"></div>
            <WandIcon className="w-16 h-16 text-white transform transition-transform group-hover:rotate-12"/>
        </button>
        <h3 className="text-xl font-bold text-white mt-4">Ready to Transform?</h3>
        <p className="text-purple-300/80">Unleash the magic!</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ tier, result, isLoading, error, canTransform, onTransform, hasFile, videoResult, isVideoLoading, videoError, onCreateVideo }) => {
  const renderContent = () => {
    if (isLoading) return <ImageLoader />;
    if (error) return <ErrorDisplay message={error} />;
    
    if (videoResult) {
        return (
            <div className="w-full h-full relative group">
                <video src={videoResult} className="w-full h-full object-contain" controls autoPlay loop />
                <a
                    href={videoResult}
                    download="halloween-video.mp4"
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all transform opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Video
                </a>
            </div>
        );
    }
    
    if (result) {
        return (
            <div className="w-full h-full relative group">
                <img src={result} alt="Transformed result" className="w-full h-full object-contain" />
                <a
                    href={result}
                    download="halloween-transformation.png"
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all transform opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Image
                </a>
                {tier === 'magic' && (
                    <div className="absolute bottom-4 left-4 transform opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <button
                            onClick={onCreateVideo}
                            disabled={isVideoLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-wait"
                        >
                            <RobotIcon className="w-5 h-5"/>
                            {isVideoLoading ? 'Animating...' : 'Create Video'}
                        </button>
                    </div>
                )}
            </div>
        );
    }
    if (canTransform) {
        return <TransformButton onClick={onTransform} />;
    }
    return <Placeholder hasFile={hasFile} />;
  }

  const renderOverlay = () => {
    if (isVideoLoading) return <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"><VideoLoader /></div>;
    if (videoError) return <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"><ErrorDisplay message={videoError} /></div>;
    return null;
  }

  return (
    <div className="bg-black/20 p-4 rounded-xl card-glow-border h-full">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <LightningIcon className="w-6 h-6 text-green-400" />
        AI Transformation
      </h2>
      <div className="relative w-full h-[480px] bg-black/30 rounded-lg flex items-center justify-center overflow-hidden">
        {renderContent()}
        {renderOverlay()}
      </div>
    </div>
  );
};

export default ResultDisplay;
