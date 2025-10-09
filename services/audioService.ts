// Audio service for playing Halloween-themed sounds
// Handles audio playback with proper error handling and autoplay restrictions

class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) {
      console.log('🔊 Audio already initialized');
      return;
    }

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.isInitialized = true;
      console.log('🔊 Audio initialized successfully');
    } catch (error) {
      console.warn('🔇 AudioContext not supported:', error);
    }
  }

  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) {
      console.warn(
        `🔇 Cannot load sound ${name}: AudioContext not initialized`
      );
      return;
    }

    try {
      console.log(`🔊 Loading sound: ${name} from ${url}`);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
      console.log(`✅ Sound loaded: ${name}`);
    } catch (error) {
      console.warn(`⚠️ Failed to load sound ${name}:`, error);
    }
  }

  async play(name: string, volume: number = 0.5): Promise<void> {
    console.log(`🔊 Attempting to play sound: ${name}`);
    await this.initialize();

    if (!this.audioContext) {
      console.warn('🔇 AudioContext not available');
      return;
    }

    // Resume audio context if it's suspended (due to autoplay restrictions)
    if (this.audioContext.state === 'suspended') {
      console.log('🔊 Resuming suspended audio context...');
      await this.audioContext.resume();
    }

    const buffer = this.sounds.get(name);
    if (!buffer) {
      console.warn(`⚠️ Sound ${name} not loaded, skipping...`);
      return;
    }

    console.log(`✅ Playing sound: ${name}`);
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  // Simple tone generator for fallback sounds
  async playTone(
    frequency: number,
    duration: number,
    volume: number = 0.3
  ): Promise<void> {
    console.log(`🎵 Playing fallback tone: ${frequency}Hz for ${duration}s`);
    await this.initialize();

    if (!this.audioContext) {
      console.warn('🔇 Cannot play tone: AudioContext not available');
      return;
    }

    if (this.audioContext.state === 'suspended') {
      console.log('🔊 Resuming suspended audio context...');
      await this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );
    oscillator.stop(this.audioContext.currentTime + duration);
    console.log('✅ Tone playing');
  }
}

const audioPlayer = new AudioPlayer();

// Preload sounds on first user interaction
let soundsLoaded = false;
async function preloadSounds() {
  if (soundsLoaded) {
    console.log('🔊 Sounds already preloaded');
    return;
  }
  console.log('🔊 Preloading audio files...');
  soundsLoaded = true;

  await audioPlayer.initialize();

  // Try to load audio files if they exist
  const soundFiles = [
    { name: 'login', url: '/audio/login.wav' },
    { name: 'imageSuccess', url: '/audio/image-success.wav' },
    { name: 'videoSuccess', url: '/audio/video-success.wav' },
  ];

  for (const { name, url } of soundFiles) {
    await audioPlayer.loadSound(name, url);
  }
  console.log('✅ Audio preload complete');
}

// Call preload on first user interaction
document.addEventListener('click', preloadSounds, { once: true });
document.addEventListener('touchstart', preloadSounds, { once: true });

export const playLoginSound = async () => {
  console.log('🎃 playLoginSound called');
  try {
    await preloadSounds();

    // Try to play the loaded sound, fallback to tone
    if (audioPlayer['sounds'].has('login')) {
      console.log('🔊 Playing login audio file');
      await audioPlayer.play('login', 0.4);
    } else {
      console.log('🎵 Playing login fallback tones');
      // Spooky descending tone
      await audioPlayer.playTone(440, 0.15, 0.2);
      setTimeout(() => audioPlayer.playTone(330, 0.15, 0.2), 150);
    }
  } catch (error) {
    console.error('❌ Failed to play login sound:', error);
  }
};

export const playImageSuccessSound = async () => {
  console.log('🎉 playImageSuccessSound called');
  try {
    await preloadSounds();

    if (audioPlayer['sounds'].has('imageSuccess')) {
      console.log('🔊 Playing image success audio file');
      await audioPlayer.play('imageSuccess', 0.5);
    } else {
      console.log('🎵 Playing image success fallback tones');
      // Success jingle: ascending tones
      await audioPlayer.playTone(523, 0.1, 0.3);
      setTimeout(() => audioPlayer.playTone(659, 0.1, 0.3), 100);
      setTimeout(() => audioPlayer.playTone(784, 0.2, 0.3), 200);
    }
  } catch (error) {
    console.error('❌ Failed to play image success sound:', error);
  }
};

export const playVideoSuccessSound = async () => {
  console.log('🎬 playVideoSuccessSound called');
  try {
    await preloadSounds();

    if (audioPlayer['sounds'].has('videoSuccess')) {
      console.log('🔊 Playing video success audio file');
      await audioPlayer.play('videoSuccess', 0.5);
    } else {
      console.log('🎵 Playing video success fallback tones');
      // Triumphant chord: multiple tones
      await audioPlayer.playTone(523, 0.3, 0.2);
      setTimeout(() => audioPlayer.playTone(659, 0.3, 0.2), 50);
      setTimeout(() => audioPlayer.playTone(784, 0.3, 0.2), 100);
    }
  } catch (error) {
    console.error('❌ Failed to play video success sound:', error);
  }
};
