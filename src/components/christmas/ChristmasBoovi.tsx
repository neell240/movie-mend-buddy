import { cn } from "@/lib/utils";
import booviPopcorn from "@/assets/boovi-christmas-popcorn.png";

interface ChristmasBooviProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showGlow?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export const ChristmasBoovi = ({ 
  className,
  size = "md",
  showGlow = true,
  animate = true,
}: ChristmasBooviProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Soft golden glow behind Boovi */}
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-25 blur-xl scale-125 -z-10" />
      )}
      
      {/* Main Christmas Boovi image */}
      <img
        src={booviPopcorn}
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