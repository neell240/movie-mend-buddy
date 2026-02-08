import { useEffect, useState, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  layer: 'back' | 'mid' | 'front';
  swayAmount: number;
  rotation: number;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
}

interface FallingHeartsProps {
  enabled?: boolean;
  className?: string;
}

export const FallingHearts = ({ enabled = true, className }: FallingHeartsProps) => {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(enabled);
  const prevEnabled = useRef(enabled);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle exit animation when disabled
  useEffect(() => {
    if (prevEnabled.current && !enabled) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 800);
      return () => clearTimeout(timer);
    } else if (!prevEnabled.current && enabled) {
      setShouldRender(true);
      setIsExiting(false);
    }
    prevEnabled.current = enabled;
  }, [enabled]);

  // Layered hearts for parallax depth effect
  const hearts = useMemo<Heart[]>(() => {
    const allHearts: Heart[] = [];
    
    // Back layer (small, slow, subtle)
    for (let i = 0; i < 10; i++) {
      allHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 8,
        size: 12 + Math.random() * 6,
        opacity: 0.25 + Math.random() * 0.15,
        layer: 'back',
        swayAmount: 15 + Math.random() * 20,
        rotation: Math.random() * 40 - 20,
      });
    }
    
    // Mid layer (medium)
    for (let i = 10; i < 20; i++) {
      allHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 10 + Math.random() * 6,
        size: 16 + Math.random() * 8,
        opacity: 0.35 + Math.random() * 0.2,
        layer: 'mid',
        swayAmount: 20 + Math.random() * 25,
        rotation: Math.random() * 50 - 25,
      });
    }
    
    // Front layer (larger, faster)
    for (let i = 20; i < 28; i++) {
      allHearts.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 7 + Math.random() * 5,
        size: 20 + Math.random() * 10,
        opacity: 0.5 + Math.random() * 0.3,
        layer: 'front',
        swayAmount: 25 + Math.random() * 30,
        rotation: Math.random() * 60 - 30,
      });
    }
    
    return allHearts;
  }, []);

  // Pink sparkles for romantic effect
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 60,
      delay: Math.random() * 10,
      size: 4 + Math.random() * 4,
    }));
  }, []);

  if (!mounted || !shouldRender) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none z-30 overflow-hidden transition-opacity duration-500",
        isExiting && "opacity-0",
        className
      )}
      aria-hidden="true"
    >
      {/* Hearts with parallax layers */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={cn(
            "absolute",
            isExiting ? "heart-exit" : "animate-heartfall"
          )}
          style={{
            left: `${heart.left}%`,
            top: '-40px',
            opacity: heart.opacity,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: isExiting ? 1 : 'infinite',
            filter: heart.layer === 'back' ? 'blur(1.5px)' : heart.layer === 'front' ? 'none' : 'blur(0.5px)',
            zIndex: heart.layer === 'back' ? 29 : heart.layer === 'front' ? 31 : 30,
            transform: `rotate(${heart.rotation}deg)`,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-rose-400"
            style={{
              filter: `drop-shadow(0 0 ${heart.size / 3}px hsl(350 80% 60% / 0.4))`,
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Pink sparkles for magical effect */}
      {!isExiting && sparkles.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '5s',
            background: 'radial-gradient(circle, hsl(330 80% 75%) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Subtle romantic vignette */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500",
          isExiting && "opacity-0"
        )}
        style={{
          boxShadow: 'inset 0 0 180px 60px hsl(350 50% 8% / 0.25)',
        }}
      />
    </div>
  );
};
