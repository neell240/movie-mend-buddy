import { useEffect, useState } from "react";
import { BooviAnimated } from "./BooviAnimated";

interface BooviWelcomeProps {
  onComplete?: () => void;
  message?: string;
  autoHide?: boolean;
  hideDelay?: number;
}

export const BooviWelcome = ({ 
  onComplete,
  message = "Welcome to MovieMend! 🎬",
  autoHide = true,
  hideDelay = 3000
}: BooviWelcomeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6 text-center px-4 animate-scale-in">
        <BooviAnimated 
          animation="wave" 
          size="xl" 
          showSparkles
        />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {message}
          </h2>
          <p className="text-muted-foreground">
            Your AI movie buddy is ready!
          </p>
        </div>
      </div>
    </div>
  );
};
