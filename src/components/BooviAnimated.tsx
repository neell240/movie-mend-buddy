import { cn } from "@/lib/utils";
import booviImage from "@/assets/boovi-transparent.png";

type BooviAnimation = 
  | "wave" 
  | "idle" 
  | "jump" 
  | "think" 
  | "loading" 
  | "point"
  | "celebrate"
  | "eat"
  | "shocked"
  | "sad"
  | "angry"
  | "laugh"
  | "shh"
  | "sleep"
  | "confused"
  | "excited"
  | "hug"
  | "typing"
  | "fly"
  | "none";

interface BooviAnimatedProps {
  animation?: BooviAnimation;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSparkles?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export const BooviAnimated = ({ 
  animation = "idle", 
  className,
  size = "md",
  showSparkles = false 
}: BooviAnimatedProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Sparkles container */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="boovi-sparkle boovi-sparkle-1">✨</div>
          <div className="boovi-sparkle boovi-sparkle-2">✨</div>
          <div className="boovi-sparkle boovi-sparkle-3">✨</div>
        </div>
      )}
      
      {/* Main Boovi image with animation */}
      <img
        src={booviImage}
        alt="Boovi"
        className={cn(
          sizeClasses[size],
          "object-contain",
          {
            "animate-boovi-wave": animation === "wave",
            "animate-boovi-idle": animation === "idle",
            "animate-boovi-jump": animation === "jump",
            "animate-boovi-think": animation === "think",
            "animate-boovi-loading": animation === "loading",
            "animate-boovi-point": animation === "point",
            "animate-boovi-celebrate": animation === "celebrate",
            "animate-boovi-eat": animation === "eat",
            "animate-boovi-shocked": animation === "shocked",
            "animate-boovi-sad": animation === "sad",
            "animate-boovi-angry": animation === "angry",
            "animate-boovi-laugh": animation === "laugh",
            "animate-boovi-shh": animation === "shh",
            "animate-boovi-sleep": animation === "sleep",
            "animate-boovi-confused": animation === "confused",
            "animate-boovi-excited": animation === "excited",
            "animate-boovi-hug": animation === "hug",
            "animate-boovi-typing": animation === "typing",
            "animate-boovi-fly": animation === "fly",
          }
        )}
      />
      
      {/* Glow effect for thinking mode */}
      {animation === "think" && (
        <div className="absolute inset-0 animate-boovi-glow rounded-full blur-xl bg-primary/20 -z-10" />
      )}
    </div>
  );
};
