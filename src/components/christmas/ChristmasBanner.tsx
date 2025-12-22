import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Sparkles } from "lucide-react";

interface ChristmasBannerProps {
  className?: string;
}

export const ChristmasBanner = ({ className }: ChristmasBannerProps) => {
  const { isChristmas, isChristmasDay, daysUntilChristmas } = useSeasonal();

  if (!isChristmas) return null;

  const getMessage = () => {
    if (isChristmasDay) {
      return "🎄 Merry Christmas! Let's find the perfect movie 🍿";
    }
    if (daysUntilChristmas === 1) {
      return "🎄 Christmas Eve! One more day of movie magic ✨";
    }
    if (daysUntilChristmas > 0 && daysUntilChristmas <= 2) {
      return `🎄 ${daysUntilChristmas} days until Christmas! Time for holiday movies 🎬`;
    }
    return "🎄 Your Christmas Movie Helper 🍿";
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 p-4 ${className}`}>
      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 text-3xl opacity-30">❄️</div>
      <div className="absolute -bottom-2 -left-2 text-2xl opacity-30">🎄</div>
      
      <div className="flex items-center gap-4">
        <ChristmasBoovi mood="happy" size="md" animate />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Christmas Edition
            </span>
          </div>
          <p className="font-semibold text-foreground">
            {getMessage()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            MovieMend — Your Christmas Movie Helper
          </p>
        </div>
      </div>
    </div>
  );
};
