import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  drift: number;
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

    // Light, magical snowfall - 25 soft flakes
    const count = 25;
    
    const flakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 18 + Math.random() * 12, // Slow: 18-30 seconds
      size: Math.random() * 3 + 2, // Soft: 2-5px
      opacity: Math.random() * 0.25 + 0.15, // Gentle: 0.15-0.40
      drift: Math.random() * 30 - 15, // Slight horizontal drift
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
          className="absolute rounded-full bg-white animate-snowfall"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            filter: `blur(${flake.size > 3.5 ? 0.5 : 0}px)`,
            boxShadow: `0 0 ${flake.size * 2}px hsl(0 0% 100% / 0.3)`,
          }}
        />
      ))}
    </div>
  );
};