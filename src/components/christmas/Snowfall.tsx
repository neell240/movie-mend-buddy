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
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export const Snowfall = ({ enabled = true, intensity = 'light', className }: SnowfallProps) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    if (!enabled) {
      setSnowflakes([]);
      return;
    }

    const count = intensity === 'light' ? 25 : intensity === 'medium' ? 50 : 80;
    
    const flakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.3,
    }));

    setSnowflakes(flakes);
  }, [enabled, intensity]);

  if (!enabled || snowflakes.length === 0) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none z-50 overflow-hidden",
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
          }}
        />
      ))}
    </div>
  );
};
