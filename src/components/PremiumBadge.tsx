import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const PremiumBadge = ({ className, size = 'md', showText = true }: PremiumBadgeProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
        'border border-amber-500/40',
        'text-amber-400 font-medium',
        className
      )}
    >
      <Crown className={cn(sizeClasses[size], 'text-amber-400')} />
      {showText && <span className={textSizes[size]}>Premium</span>}
    </div>
  );
};
