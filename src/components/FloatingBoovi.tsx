import { useState, useEffect, useCallback, useRef } from 'react';
import { BooviAnimated } from './BooviAnimated';
import { useBooviPersonality } from '@/contexts/BooviPersonalityContext';
import { useBooviSounds, ANIMATION_SOUNDS } from '@/hooks/useBooviSounds';
import { cn } from '@/lib/utils';
import { X, MessageCircle, Volume2, VolumeX } from 'lucide-react';

interface FloatingBooviProps {
  enabled?: boolean;
}

export const FloatingBoovi = ({ enabled = true }: FloatingBooviProps) => {
  const { currentState, trigger } = useBooviPersonality();
  const { playSound, setEnabled, isEnabled } = useBooviSounds();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [showMessage, setShowMessage] = useState(false);
  const [soundsOn, setSoundsOn] = useState(true);
  const lastAnimationRef = useRef(currentState.animation);

  // Play sound when animation changes
  useEffect(() => {
    if (currentState.animation !== lastAnimationRef.current) {
      const sound = ANIMATION_SOUNDS[currentState.animation];
      if (sound) {
        playSound(sound);
      }
      lastAnimationRef.current = currentState.animation;
    }
  }, [currentState.animation, playSound]);

  // Initialize sound preference
  useEffect(() => {
    setSoundsOn(isEnabled());
  }, [isEnabled]);

  // Show message when state changes
  useEffect(() => {
    if (currentState.message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentState.message, currentState.timestamp]);

  // Handle scroll position
  useEffect(() => {
    if (!enabled) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Trigger scroll events
      if (scrollY > lastScrollY) {
        trigger('scroll_down');
      } else if (scrollY < lastScrollY) {
        trigger('scroll_up');
      }

      // Check if at bottom
      if (scrollY + windowHeight >= documentHeight - 50) {
        trigger('page_bottom');
      }

      // Check if at top
      if (scrollY < 50) {
        trigger('page_top');
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const requestScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestScroll, { passive: true });
    return () => window.removeEventListener('scroll', requestScroll);
  }, [enabled, trigger]);

  // Handle network status
  useEffect(() => {
    if (!enabled) return;

    const handleOnline = () => trigger('network_online');
    const handleOffline = () => trigger('network_offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enabled, trigger]);

  const handleClick = useCallback(() => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      // Cycle through fun animations
      const funAnimations = ['wave', 'celebrate', 'jump', 'eat', 'laugh'] as const;
      const randomAnim = funAnimations[Math.floor(Math.random() * funAnimations.length)];
      trigger('achievement', { message: "You found me! 👻🍿" });
    }
  }, [isMinimized, trigger]);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  }, []);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  }, []);

  const handleToggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !soundsOn;
    setSoundsOn(newState);
    setEnabled(newState);
    // Play a sound to confirm it's on
    if (newState) {
      playSound('ding');
    }
  }, [soundsOn, setEnabled, playSound]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Floating Boovi Widget */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          isMinimized ? "scale-75 opacity-70 hover:opacity-100" : "scale-100"
        )}
        style={{
          bottom: `${position.bottom}px`,
          right: `${position.right}px`,
        }}
      >
        {/* Message Bubble */}
        {showMessage && currentState.message && !isMinimized && (
          <div className="absolute bottom-full right-0 mb-4 animate-fade-in">
            <div className="relative bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-none shadow-lg max-w-xs">
              <p className="text-sm font-medium">{currentState.message}</p>
              <div className="absolute -bottom-2 right-0 w-4 h-4 bg-primary transform rotate-45" />
            </div>
          </div>
        )}

        {/* Boovi Container */}
        <div
          className={cn(
            "relative group cursor-pointer",
            "transition-transform duration-200",
            "hover:scale-110 active:scale-95"
          )}
          onClick={handleClick}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          
          {/* Boovi */}
          <div className="relative bg-background/95 backdrop-blur-sm rounded-full p-3 shadow-xl border-2 border-border">
            <BooviAnimated
              animation={currentState.animation}
              size="md"
              showSparkles={currentState.mood === "celebrating" || currentState.mood === "excited"}
            />
          </div>

          {/* Controls (show on hover) */}
          {!isMinimized && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <button
                onClick={handleToggleSound}
                className="w-6 h-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted"
                aria-label={soundsOn ? "Mute Boovi" : "Unmute Boovi"}
              >
                {soundsOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>
              <button
                onClick={handleMinimize}
                className="w-6 h-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted"
                aria-label="Minimize Boovi"
              >
                <MessageCircle className="w-3 h-3" />
              </button>
              <button
                onClick={handleClose}
                className="w-6 h-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                aria-label="Hide Boovi"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Mood Indicator */}
          {!isMinimized && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                currentState.mood === "happy" && "bg-green-500",
                currentState.mood === "excited" && "bg-yellow-500 animate-pulse",
                currentState.mood === "sad" && "bg-blue-500",
                currentState.mood === "angry" && "bg-red-500",
                currentState.mood === "focused" && "bg-purple-500",
                currentState.mood === "tired" && "bg-gray-500",
                currentState.mood === "celebrating" && "bg-gradient-to-r from-yellow-500 to-pink-500 animate-pulse",
                currentState.mood === "neutral" && "bg-muted-foreground"
              )} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
