import { useSeasonal } from "@/hooks/useChristmasMode";
import booviSanta from "@/assets/boovi-christmas-santa.png";

interface ChristmasBannerProps {
  className?: string;
}

export const ChristmasBanner = ({ className }: ChristmasBannerProps) => {
  const { isChristmas, isChristmasDay, daysUntilChristmas } = useSeasonal();

  if (!isChristmas) return null;

  const getMessage = () => {
    if (isChristmasDay) {
      return "Merry Christmas! Let's find the perfect movie";
    }
    if (daysUntilChristmas === 1) {
      return "Christmas Eve! One more day of movie magic";
    }
    if (daysUntilChristmas > 0 && daysUntilChristmas <= 2) {
      return `${daysUntilChristmas} days until Christmas!`;
    }
    return "Your Christmas Movie Helper";
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-card p-5 ${className}`}>
      {/* Subtle gold glow behind Boovi */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[hsl(var(--christmas-gold))] opacity-20 blur-2xl" />
      
      <div className="flex items-center gap-4 relative z-10">
        {/* Boovi with soft glow */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-30 blur-xl scale-110" />
          <img 
            src={booviSanta} 
            alt="Christmas Boovi" 
            className="w-20 h-20 object-contain relative z-10 animate-boovi-float"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--christmas-wine))]">
              🎄 Christmas Edition
            </span>
          </div>
          <p className="font-bold text-card-foreground text-lg leading-tight">
            {getMessage()}
          </p>
          <p className="text-sm text-card-foreground/70 mt-1">
            MovieMend — Hot chocolate & movie night 🍿
          </p>
        </div>
      </div>
    </div>
  );
};