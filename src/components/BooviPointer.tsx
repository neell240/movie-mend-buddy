import { BooviAnimated } from "./BooviAnimated";
import { cn } from "@/lib/utils";

interface BooviPointerProps {
  message: string;
  direction?: "up" | "right" | "down" | "left";
  className?: string;
}

export const BooviPointer = ({ 
  message, 
  direction = "right",
  className 
}: BooviPointerProps) => {
  const directionRotation = {
    up: "-rotate-90",
    right: "rotate-0",
    down: "rotate-90",
    left: "rotate-180",
  };

  const arrowPosition = {
    up: "top-full mt-2",
    right: "left-full ml-2",
    down: "bottom-full mb-2",
    left: "right-full mr-2",
  };

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <BooviAnimated 
        animation="point" 
        size="md" 
        className={directionRotation[direction]}
      />
      <div className={cn(
        "absolute whitespace-nowrap px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-lg",
        arrowPosition[direction]
      )}>
        {message}
      </div>
    </div>
  );
};
