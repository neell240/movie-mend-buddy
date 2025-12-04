import { useCallback, useRef, useEffect } from 'react';

type SoundType = 
  | 'chirp' | 'happy' | 'sad' | 'crunch' | 'pop' 
  | 'whoosh' | 'ding' | 'boing' | 'snore' | 'sparkle';

export const useBooviSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    // Check localStorage for sound preference
    const savedPref = localStorage.getItem('boovi-sounds-enabled');
    enabledRef.current = savedPref !== 'false';
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playChirp = useCallback((ctx: AudioContext, frequency = 800, duration = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration * 0.5);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, []);

  const playHappy = useCallback((ctx: AudioContext) => {
    // Happy ascending notes
    [0, 0.1, 0.2].forEach((delay, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + (i * 200), ctx.currentTime);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }, delay * 1000);
    });
  }, []);

  const playSad = useCallback((ctx: AudioContext) => {
    // Descending sad tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }, []);

  const playCrunch = useCallback((ctx: AudioContext) => {
    // Popcorn crunch - noise burst
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(ctx.currentTime);
  }, []);

  const playPop = useCallback((ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playWhoosh = useCallback((ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.5;
    }
    
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
    filter.Q.setValueAtTime(1, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(ctx.currentTime);
  }, []);

  const playDing = useCallback((ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  const playBoing = useCallback((ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const playSnore = useCallback((ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  }, []);

  const playSparkle = useCallback((ctx: AudioContext) => {
    [0, 50, 100, 150].forEach((delay) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        const freq = 1000 + Math.random() * 1000;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }, delay);
    });
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      switch (type) {
        case 'chirp': playChirp(ctx); break;
        case 'happy': playHappy(ctx); break;
        case 'sad': playSad(ctx); break;
        case 'crunch': playCrunch(ctx); break;
        case 'pop': playPop(ctx); break;
        case 'whoosh': playWhoosh(ctx); break;
        case 'ding': playDing(ctx); break;
        case 'boing': playBoing(ctx); break;
        case 'snore': playSnore(ctx); break;
        case 'sparkle': playSparkle(ctx); break;
      }
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, [getAudioContext, playChirp, playHappy, playSad, playCrunch, playPop, playWhoosh, playDing, playBoing, playSnore, playSparkle]);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
    localStorage.setItem('boovi-sounds-enabled', enabled.toString());
  }, []);

  return { playSound, setEnabled, isEnabled: () => enabledRef.current };
};

// Map animations to sounds
export const ANIMATION_SOUNDS: Record<string, SoundType | null> = {
  wave: 'chirp',
  jump: 'boing',
  celebrate: 'happy',
  eat: 'crunch',
  shocked: 'pop',
  sad: 'sad',
  angry: 'pop',
  laugh: 'happy',
  sleep: 'snore',
  confused: 'chirp',
  excited: 'sparkle',
  hug: 'happy',
  fly: 'whoosh',
  think: null,
  idle: null,
  loading: null,
  point: null,
  typing: null,
  shh: null,
};
