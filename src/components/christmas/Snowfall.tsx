import { useEffect, useState, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  layer: 'back' | 'mid' | 'front';
  swayAmount: number;
}

interface Sparkle {
  id: number;
  left: number;
  top: number;
  delay: number;
  size: number;
}

interface SnowfallProps {
  enabled?: boolean;
  className?: string;
}

export const Snowfall = ({ enabled = true, className }: SnowfallProps) => {
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
      // Trigger exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 800);
      return () => clearTimeout(timer);
    } else if (!prevEnabled.current && enabled) {
      // Enable immediately
      setShouldRender(true);
      setIsExiting(false);
    }
    prevEnabled.current = enabled;
  }, [enabled]);

  // Layered snowflakes for parallax depth effect
  const snowflakes = useMemo<Snowflake[]>(() => {
    const flakes: Snowflake[] = [];
    
    // Back layer (small, slow, subtle)
    for (let i = 0; i < 12; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 12 + Math.random() * 8,
        size: 2 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.2,
        layer: 'back',
        swayAmount: 10 + Math.random() * 15,
      });
    }
    
    // Mid layer (medium)
    for (let i = 12; i < 24; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 6,
        size: 3 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.25,
        layer: 'mid',
        swayAmount: 15 + Math.random() * 20,
      });
    }
    
    // Front layer (larger, faster)
    for (let i = 24; i < 35; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 4,
        size: 4 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.3,
        layer: 'front',
        swayAmount: 20 + Math.random() * 25,
      });
    }
    
    return flakes;
  }, []);

  // Occasional gold sparkles
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      top: 10 + Math.random() * 50,
      delay: Math.random() * 10,
      size: 3 + Math.random() * 3,
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
      {/* Snowflakes with parallax layers */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={cn(
            "absolute rounded-full bg-white",
            isExiting ? "snowflake-exit" : "animate-snowfall"
          )}
          style={{
            left: `${flake.left}%`,
            top: '-20px',
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: isExiting ? 1 : 'infinite',
            filter: flake.layer === 'back' ? 'blur(1px)' : flake.layer === 'front' ? 'none' : 'blur(0.5px)',
            boxShadow: `0 0 ${flake.size * 2}px hsl(0 0% 100% / ${flake.layer === 'front' ? 0.5 : 0.3})`,
            zIndex: flake.layer === 'back' ? 29 : flake.layer === 'front' ? 31 : 30,
            ['--current-y' as string]: `${Math.random() * 100}vh`,
          }}
        />
      ))}

      {/* Gold sparkles for magical effect */}
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
            background: 'radial-gradient(circle, hsl(42 85% 75%) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Subtle vignette for cozy focus */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-500",
          isExiting && "opacity-0"
        )}
        style={{
          boxShadow: 'inset 0 0 180px 60px hsl(355 50% 6% / 0.3)',
        }}
      />
    </div>
  );
};
