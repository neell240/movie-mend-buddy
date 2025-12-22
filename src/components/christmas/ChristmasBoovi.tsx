import { cn } from "@/lib/utils";
import booviPopcorn from "@/assets/boovi-christmas-popcorn.png";
import booviSanta from "@/assets/boovi-christmas-santa.png";
import booviExcited from "@/assets/boovi-christmas-excited.png";
import booviHappy from "@/assets/boovi-christmas-happy.png";
import booviCozy from "@/assets/boovi-christmas-cozy.png";

export type ChristmasBooviVariant = "popcorn" | "santa" | "excited" | "happy" | "cozy";

interface ChristmasBooviProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: ChristmasBooviVariant;
  showGlow?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

const variantImages: Record<ChristmasBooviVariant, string> = {
  popcorn: booviPopcorn,
  santa: booviSanta,
  excited: booviExcited,
  happy: booviHappy,
  cozy: booviCozy,
};

export const ChristmasBoovi = ({ 
  className,
  size = "md",
  variant = "popcorn",
  showGlow = true,
  animate = true,
}: ChristmasBooviProps) => {
  const imageSrc = variantImages[variant] || booviPopcorn;
  
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Soft golden glow behind Boovi */}
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-25 blur-xl scale-125 -z-10" />
      )}
      
      {/* Main Christmas Boovi image */}
      <img
        src={imageSrc}
        alt="Christmas Boovi"
        className={cn(
          sizeClasses[size],
          "object-contain",
          animate && "animate-boovi-float"
        )}
      />
    </div>
  );
};
