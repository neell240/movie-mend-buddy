import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieRatingProps {
  rating: number | null;
  onRate: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

export const MovieRating = ({ rating, onRate, size = "md", readonly = false }: MovieRatingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = rating !== null && star <= rating;
        
        return (
          <button
            key={star}
            onClick={() => !readonly && onRate(star)}
            disabled={readonly}
            className={cn(
              "transition-all",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                starSize,
                isActive
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-500"
              )}
            />
          </button>
        );
      })}
      {rating && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating}/5
        </span>
      )}
    </div>
  );
};