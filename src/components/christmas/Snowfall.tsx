import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  layer: 'back' | 'mid' | 'front'; // Parallax layers
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

  // Layered snowflakes for parallax depth effect
  const snowflakes = useMemo<Snowflake[]>(() => {
    if (!enabled) return [];
    
    const flakes: Snowflake[] = [];
    
    // Back layer (small, slow, blurred)
    for (let i = 0; i < 15; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 30 + Math.random() * 15,
        size: 1.5 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.1,
        layer: 'back',
      });
    }
    
    // Mid layer (medium)
    for (let i = 15; i < 30; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 20 + Math.random() * 10,
        size: 2 + Math.random() * 2,
        opacity: 0.25 + Math.random() * 0.15,
        layer: 'mid',
      });
    }
    
    // Front layer (larger, faster, sharper)
    for (let i = 30; i < 40; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 12 + Math.random() * 8,
        size: 3 + Math.random() * 2,
        opacity: 0.35 + Math.random() * 0.2,
        layer: 'front',
      });
    }
    
    return flakes;
  }, [enabled]);

  // Occasional gold sparkles
  const sparkles = useMemo<Sparkle[]>(() => {
    if (!enabled) return [];
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      top: 10 + Math.random() * 50,
      delay: Math.random() * 10,
      size: 3 + Math.random() * 3,
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
      {/* Snowflakes with parallax layers */}
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
            filter: flake.layer === 'back' ? 'blur(1px)' : flake.layer === 'front' ? 'none' : 'blur(0.3px)',
            boxShadow: flake.layer === 'front' 
              ? `0 0 ${flake.size * 2}px hsl(0 0% 100% / 0.3)` 
              : 'none',
            zIndex: flake.layer === 'back' ? 29 : flake.layer === 'front' ? 31 : 30,
          }}
        />
      ))}

      {/* Gold sparkles for magical effect */}
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
            animationDuration: '5s',
            background: 'radial-gradient(circle, hsl(42 85% 75%) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Subtle vignette for cozy focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 180px 60px hsl(140 25% 6% / 0.35)',
        }}
      />
    </div>
  );
};
