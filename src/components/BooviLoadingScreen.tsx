import { BooviAnimated } from "./BooviAnimated";

interface BooviLoadingScreenProps {
  message?: string;
}

export const BooviLoadingScreen = ({ 
  message = "Loading your movies..." 
}: BooviLoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <BooviAnimated 
          animation="loading" 
          size="xl" 
          showSparkles
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {message}
          </h3>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
