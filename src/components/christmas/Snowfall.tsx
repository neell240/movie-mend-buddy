import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

interface SnowfallProps {
  enabled?: boolean;
  className?: string;
}

export const Snowfall = ({ enabled = true, className }: SnowfallProps) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!enabled) {
      setSnowflakes([]);
      return;
    }

    // Minimal, slow, subtle snow - only 15 flakes
    const count = 15;
    
    const flakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 15, // Very slow: 20-35 seconds
      size: Math.random() * 2 + 1.5, // Small: 1.5-3.5px
      opacity: Math.random() * 0.15 + 0.08, // Very low opacity: 0.08-0.23
    }));

    setSnowflakes(flakes);
  }, [enabled]);

  if (!enabled || snowflakes.length === 0) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none z-40 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-[hsl(var(--christmas-cream))] animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        />
      ))}
    </div>
  );
};