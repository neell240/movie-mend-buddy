import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize snowflakes to prevent re-renders
  const snowflakes = useMemo<Snowflake[]>(() => {
    if (!enabled) return [];
    
    // Subtle, magical snowfall - 30 soft flakes
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 15, // Very slow: 20-35 seconds
      size: 2 + Math.random() * 3, // Soft: 2-5px
      opacity: 0.2 + Math.random() * 0.25, // Gentle: 0.2-0.45
    }));
  }, [enabled]);

  // Occasional sparkles
  const sparkles = useMemo<Sparkle[]>(() => {
    if (!enabled) return [];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 60,
      delay: Math.random() * 8,
      size: 4 + Math.random() * 4,
    }));
  }, [enabled]);

  if (!enabled || !mounted || snowflakes.length === 0) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none z-30 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Snowflakes */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            filter: flake.size > 3.5 ? 'blur(0.5px)' : 'none',
            boxShadow: `0 0 ${flake.size * 2}px hsl(0 0% 100% / 0.2)`,
          }}
        />
      ))}

      {/* Occasional sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '4s',
            background: 'radial-gradient(circle, hsl(30 60% 85%) 0%, transparent 70%)',
          }}
        />
      ))}

      {/* Vignette effect for cozy focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 80px hsl(120 32% 8% / 0.35)',
        }}
      />
    </div>
  );
};
