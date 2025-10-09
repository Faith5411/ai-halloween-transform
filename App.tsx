import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import PhotoUploader from './components/PhotoUploader';
import CostumeSelector from './components/CostumePrompt';
import ResultDisplay from './components/ResultDisplay';
import Pricing from './components/Pricing';
import { PaymentSuccess, PaymentCanceled } from './components/PaymentSuccess';
import {
  transformImage,
  generateVideoFromImage,
} from './services/geminiService';
import {
  playLoginSound,
  playImageSuccessSound,
  playVideoSuccessSound,
} from './services/audioService';
import type { UploadedFile, NightmareOption, Tier } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { FloatingGhostIcon } from './components/Icons';

function App() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [selectedNightmare, setSelectedNightmare] =
    useState<NightmareOption | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // New state for tiers and video
  const [tier, setTier] = useState<Tier>('basic');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Payment state
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentCanceled, setShowPaymentCanceled] = useState(false);

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
  }, [file, customPrompt]);

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
        <Header />

        <Pricing selectedTier={tier} onSelectTier={handleTierChange} />

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
      {showPaymentSuccess && <PaymentSuccess />}
      {showPaymentCanceled && <PaymentCanceled />}
    </div>
  );
}

export default App;
