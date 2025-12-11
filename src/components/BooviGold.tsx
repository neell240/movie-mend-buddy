import booviImage from '@/assets/boovi-transparent.png';
import { cn } from '@/lib/utils';

interface BooviGoldProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BooviGold = ({ className, size = 'md' }: BooviGoldProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Gold glow effect */}
      <div
        className={cn(
          sizeClasses[size],
          'absolute inset-0 blur-xl opacity-60',
          'bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full'
        )}
      />
      {/* Gold Boovi with CSS filter */}
      <img
        src={booviImage}
        alt="Premium Boovi"
        className={cn(
          sizeClasses[size],
          'relative z-10 object-contain drop-shadow-lg',
          // Gold filter effect
          '[filter:sepia(100%)_saturate(300%)_brightness(1.1)_hue-rotate(-10deg)]',
          'animate-float'
        )}
      />
      {/* Crown sparkle */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-amber-400 animate-pulse">
        ✨
      </div>
    </div>
  );
};
