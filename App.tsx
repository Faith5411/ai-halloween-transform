import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PhotoUploader from './components/PhotoUploader';
import CostumeSelector from './components/CostumePrompt';
import ResultDisplay from './components/ResultDisplay';
import Pricing from './components/Pricing';
import UsageDisplay from './components/UsageDisplay';
import { PaymentSuccess, PaymentCanceled } from './components/PaymentSuccess';
import ShareToGallery from './components/ShareToGallery';
import Gallery from './components/Gallery';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import { useAuth } from './contexts/AuthContext';
import {
  transformImage,
  generateVideoFromImage,
} from './services/geminiService';
import {
  playLoginSound,
  playImageSuccessSound,
  playVideoSuccessSound,
} from './services/audioService';
import {
  addBonusTransforms,
  canTransform as checkCanTransform,
  canCreateVideo as checkCanCreateVideo,
  incrementTransformCount,
  incrementVideoCount,
  getRemainingTransforms
} from './services/usageService';
import type { UploadedFile, NightmareOption, Tier } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { FloatingGhostIcon } from './components/Icons';

function App() {
  const { user, loading } = useAuth();
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [selectedNightmare, setSelectedNightmare] =
    useState<NightmareOption | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // New state for tiers and video
  const [tier, setTier] = useState<Tier>('free');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Payment state
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentCanceled, setShowPaymentCanceled] = useState(false);

  // Gallery share state
  const [showShareModal, setShowShareModal] = useState(false);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Gallery state
  const [showGallery, setShowGallery] = useState(false);

  // Check for payment status on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paidTier = urlParams.get('tier');
    const packSize = urlParams.get('pack');

    if (paymentStatus === 'success' && paidTier) {
      // Update tier based on payment
      const newTier = paidTier as Tier;
      setTier(newTier);

      // Store in localStorage for persistence
      localStorage.setItem('userTier', newTier);

      // Show success modal
      setShowPaymentSuccess(true);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      console.log('✅ Payment successful! Tier updated to:', newTier);
    } else if (paymentStatus === 'success' && packSize) {
      // Handle transform pack purchase
      const transformCount = parseInt(packSize, 10);
      addBonusTransforms(transformCount);

      // Show success modal
      setShowPaymentSuccess(true);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);

      console.log(
        `✅ Transform pack purchased! Added ${transformCount} bonus transforms`
      );
    } else if (paymentStatus === 'canceled') {
      setShowPaymentCanceled(true);

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load saved tier from localStorage on mount
  useEffect(() => {
    const savedTier = localStorage.getItem('userTier');
    if (
      savedTier &&
      (savedTier === 'free' || savedTier === 'basic' || savedTier === 'pro' || savedTier === 'magic')
    ) {
      setTier(savedTier as Tier);
      console.log('📦 Loaded saved tier:', savedTier);
    }
  }, []);

  useEffect(() => {
    // Play ambient sound on app load.
    // Note: Autoplay may be blocked by the browser until the user interacts with the page.
    playLoginSound();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // When inputs change, reset the output to avoid showing stale results.
    if (result || error || videoResult || videoError) {
      setResult(null);
      setError(null);
      setVideoResult(null);
      setVideoError(null);
    }
  }, [file, customPrompt]);

  useEffect(() => {
    // Play ambient sound on app load.
    // Note: Autoplay may be blocked by the browser until the user interacts with the page.
    playLoginSound();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleTierChange = (newTier: Tier) => {
    setTier(newTier);

    // Save to localStorage
    localStorage.setItem('userTier', newTier);

    // Reset results when tier changes
    setResult(null);
    setError(null);
    setVideoResult(null);
    setVideoError(null);
    // If switching to basic, clear custom prompt if it's not a preset
    if (newTier === 'basic' && selectedNightmare?.prompt !== customPrompt) {
      setCustomPrompt(selectedNightmare?.prompt || '');
    }
  };

  const handleFileChange = useCallback((newFile: File | null) => {
    if (newFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({ file: newFile, preview: reader.result as string });
      };
      reader.readAsDataURL(newFile);
    } else {
      setFile(null);
    }
  }, []);

  const handleSelectNightmare = (nightmare: NightmareOption) => {
    setSelectedNightmare(nightmare);
    setCustomPrompt(nightmare.prompt);
  };

  const handleTransform = useCallback(async () => {
    console.log('🎃 Transform button clicked!');
    console.log('📸 File:', file ? 'Present' : 'Missing');
    console.log(
      '📝 Prompt:',
      customPrompt ? customPrompt.substring(0, 50) + '...' : 'Missing'
    );

    if (!file || !customPrompt) {
      console.error('❌ Missing file or prompt');
      setError('Please upload a photo and select or create a nightmare!');
      return;
    }

    // Check if user has transforms remaining
    if (!checkCanTransform(tier)) {
      console.error('❌ No transforms remaining');
      setError(`You've used all your transforms for this month. Upgrade your plan or buy more transforms to continue!`);
      return;
    }

    console.log('🚀 Starting transformation...');
    setIsLoading(true);
    setError(null);
    setResult(null);
    setVideoResult(null);
    setVideoError(null);

    try {
      console.log('📦 Converting file to base64...');
      const base64Data = await fileToBase64(file.file);
      console.log('✅ Base64 conversion complete, length:', base64Data.length);

      const imagePart = {
        data: base64Data,
        mimeType: file.file.type,
      };
      console.log('📤 Sending to Gemini API...');

      const transformedImage = await transformImage([imagePart], customPrompt);
      console.log('✅ Transformation complete!');

      // Increment usage count on success
      incrementTransformCount(tier);
      const remaining = getRemainingTransforms(tier);
      console.log(`📊 Transforms remaining: ${remaining}`);

      setResult(transformedImage);
      playImageSuccessSound();
    } catch (err) {
      console.error('❌ Transformation failed:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
      });
      setError(
        'Failed to create spooky transformation. The crypt is currently closed. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [file, customPrompt, tier]);

  const handleCreateVideo = useCallback(async () => {
    console.log('🎬 Create video button clicked!');
    console.log('🖼️ Result:', result ? 'Present' : 'Missing');
    console.log('🎟️ Tier:', tier);

    if (!result || tier !== 'magic') {
      console.error('❌ Video generation not available:', {
        hasResult: !!result,
        tier,
      });
      setVideoError(
        'Video generation is only available in the Magic tier with a generated image.'
      );
      return;
    }

    // Check if user has video credits remaining
    if (!checkCanCreateVideo(tier)) {
      console.error('❌ No video credits remaining');
      setVideoError(`You've used all your video credits for this month. They'll reset next month!`);
      return;
    }

    console.log('🚀 Starting video generation...');
    setIsVideoLoading(true);
    setVideoError(null);
    setVideoResult(null);

    try {
      // The `result` is a data URL: "data:image/jpeg;base64,..."
      // We need to extract the mimeType and base64 data
      console.log('📦 Parsing image data...');
      const parts = result.split(',');
      const meta = parts[0]; // "data:image/jpeg;base64"
      const base64Data = parts[1];
      const mimeType = meta.split(':')[1].split(';')[0];
      console.log('✅ Image parsed, mime type:', mimeType);

      console.log('📤 Sending to Veo API...');
      const videoUrl = await generateVideoFromImage(
        base64Data,
        mimeType,
        customPrompt
      );
      console.log('✅ Video generation complete!');

      // Increment video usage count on success
      incrementVideoCount(tier);

      setVideoResult(videoUrl);
      playVideoSuccessSound();
    } catch (err) {
      console.error('❌ Video generation failed:', err);
      console.error('❌ Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err,
      });
      setVideoError(
        'Failed to animate your creation. The spirits are not cooperating. Please try again later.'
      );
    } finally {
      setIsVideoLoading(false);
    }
  }, [result, customPrompt, tier]);

  const canTransform = file !== null && !!customPrompt && !isLoading;

  // Show loading while checking auth
  if (loading) {
    return (
      <div className='min-h-screen bg-transparent text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>🎃</div>
          <div className='text-xl text-purple-300'>Loading...</div>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setShowAuthModal(true)}
          onSignIn={() => setShowAuthModal(true)}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return (
    <div className='min-h-screen bg-transparent text-white relative overflow-hidden'>
      {/* Animated Decorations */}
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none z-0'>
        <FloatingGhostIcon
          className='absolute top-[20%] left-[10%] w-16 h-16 text-white/10 animate-float'
          style={{ animationDuration: '8s' }}
        />
        <FloatingGhostIcon
          className='absolute top-[50%] left-[80%] w-24 h-24 text-white/10 animate-float'
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
        <FloatingGhostIcon
          className='absolute top-[70%] left-[20%] w-12 h-12 text-white/10 animate-float'
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        />
        <FloatingGhostIcon
          className='absolute top-[10%] left-[50%] w-20 h-20 text-white/10 animate-float'
          style={{ animationDuration: '9s' }}
        />
        <FloatingGhostIcon
          className='absolute top-[85%] left-[60%] w-14 h-14 text-white/10 animate-float'
          style={{ animationDuration: '11s', animationDelay: '3s' }}
        />
      </div>

      <div className='relative z-10 container mx-auto px-4 py-8 max-w-7xl'>
        <Header onShowGallery={() => setShowGallery(true)} />

        <Pricing selectedTier={tier} onSelectTier={handleTierChange} />

        {/* Usage Display - Shows credits remaining */}
        <div className='mt-8'>
          <UsageDisplay tier={tier} onUpgrade={() => {
            // Scroll to pricing section
            const pricingElement = document.querySelector('section');
            pricingElement?.scrollIntoView({ behavior: 'smooth' });
          }} />
        </div>

        <main className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
          <PhotoUploader file={file} onFileChange={handleFileChange} />

          <ResultDisplay
            tier={tier}
            result={result}
            isLoading={isLoading}
            error={error}
            canTransform={canTransform}
            onTransform={handleTransform}
            hasFile={!!file}
            onShareToGallery={() => setShowShareModal(true)}
            videoResult={videoResult}
            isVideoLoading={isVideoLoading}
            videoError={videoError}
            onCreateVideo={handleCreateVideo}
          />
        </main>

        <section className='mt-8'>
          <CostumeSelector
            tier={tier}
            selectedNightmare={selectedNightmare}
            onSelectNightmare={handleSelectNightmare}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            isLoading={isLoading}
          />
        </section>
      </div>

      {/* Payment Success/Cancel Modals */}
      {showPaymentSuccess && (
        <PaymentSuccess
          onClose={() => setShowPaymentSuccess(false)}
          tier={tier}
        />
      )}
      {showPaymentCanceled && (
        <PaymentCanceled onClose={() => setShowPaymentCanceled(false)} />
      )}

      {/* Gallery Share Modal */}
      {showShareModal && result && (
        <ShareToGallery
          imageUrl={result}
          beforeImageUrl={file?.preview}
          costumeName={selectedNightmare?.label || 'Custom Transform'}
          prompt={customPrompt}
          isVideo={!!videoResult}
          thumbnailUrl={result}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            console.log('✅ Successfully shared to gallery!');
            setShowShareModal(false);
            // Optionally open gallery after sharing
            setTimeout(() => setShowGallery(true), 500);
          }}
        />
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <Gallery onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
}

export default App;
