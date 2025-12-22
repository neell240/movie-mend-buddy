import { useSeasonal } from "@/hooks/useChristmasMode";
import booviPopcorn from "@/assets/boovi-christmas-popcorn.png";
import { Sparkles } from "lucide-react";

interface ChristmasBannerProps {
  className?: string;
}

export const ChristmasBanner = ({ className }: ChristmasBannerProps) => {
  const { isChristmas, isChristmasDay, daysUntilChristmas } = useSeasonal();

  if (!isChristmas) return null;

  const getMessage = () => {
    if (isChristmasDay) {
      return "Merry Christmas! 🎄";
    }
    if (daysUntilChristmas === 1) {
      return "Christmas Eve! ✨";
    }
    if (daysUntilChristmas > 0 && daysUntilChristmas <= 3) {
      return `${daysUntilChristmas} days to go!`;
    }
    return "Your Movie Helper 🎬";
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {/* Gradient background - cozy forest green with warm tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(145,40%,22%)] via-[hsl(145,45%,18%)] to-[hsl(150,50%,14%)]" />
      
      {/* Decorative circles for playful feel */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[hsl(var(--christmas-cranberry))] opacity-20 blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[hsl(var(--christmas-gold))] opacity-15 blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-[hsl(var(--christmas-snow))] opacity-10 blur-xl" />
      
      {/* Snow dots decoration */}
      <div className="absolute top-3 left-6 w-2 h-2 rounded-full bg-[hsl(var(--christmas-snow))] opacity-40" />
      <div className="absolute top-8 left-16 w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-snow))] opacity-30" />
      <div className="absolute bottom-6 right-20 w-2 h-2 rounded-full bg-[hsl(var(--christmas-snow))] opacity-35" />
      <div className="absolute top-1/3 right-8 w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-snow))] opacity-25" />
      
      <div className="relative z-10 p-5 flex items-center gap-4">
        {/* Boovi with warm glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-25 blur-2xl scale-150" />
          <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-snow))] opacity-15 blur-xl scale-125" />
          <img 
            src={booviPopcorn} 
            alt="Christmas Boovi" 
            className="w-24 h-24 object-contain relative z-10 animate-boovi-float drop-shadow-lg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--christmas-gold))]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--christmas-gold))]">
              Christmas Edition
            </span>
          </div>
          <p className="font-bold text-[hsl(var(--christmas-snow))] text-xl leading-tight drop-shadow-sm">
            {getMessage()}
          </p>
          <p className="text-sm text-[hsl(var(--christmas-cream))] mt-1.5 opacity-90">
            Hot chocolate & movie night 🍿☕
          </p>
        </div>
      </div>
    </div>
  );
};