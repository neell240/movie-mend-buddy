import { cn } from "@/lib/utils";
import booviHappy from "@/assets/boovi-christmas-happy.png";
import booviCozy from "@/assets/boovi-christmas-cozy.png";
import booviExcited from "@/assets/boovi-christmas-excited.png";

type ChristmasBooviMood = "happy" | "cozy" | "excited";

interface ChristmasBooviProps {
  mood?: ChristmasBooviMood;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSparkles?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

const moodImages = {
  happy: booviHappy,
  cozy: booviCozy,
  excited: booviExcited,
};

export const ChristmasBoovi = ({ 
  mood = "happy", 
  className,
  size = "md",
  showSparkles = false,
  animate = true,
}: ChristmasBooviProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Snow sparkles */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 text-lg animate-christmas-sparkle">❄️</div>
          <div className="absolute -top-1 -right-2 text-sm animate-christmas-sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute -bottom-1 -left-1 text-sm animate-christmas-sparkle" style={{ animationDelay: '1s' }}>❄️</div>
        </div>
      )}
      
      {/* Main Christmas Boovi image */}
      <img
        src={moodImages[mood]}
        alt={`Christmas Boovi - ${mood}`}
        className={cn(
          sizeClasses[size],
          "object-contain",
          animate && "animate-boovi-float"
        )}
      />
      
      {/* Subtle glow for cozy mood */}
      {mood === "cozy" && (
        <div className="absolute inset-0 rounded-full blur-xl bg-orange-400/20 -z-10 animate-pulse" />
      )}
    </div>
  );
};
