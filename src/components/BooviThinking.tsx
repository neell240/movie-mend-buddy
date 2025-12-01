import { BooviAnimated } from "./BooviAnimated";

interface BooviThinkingProps {
  message?: string;
  compact?: boolean;
}

export const BooviThinking = ({ 
  message = "Thinking...",
  compact = false
}: BooviThinkingProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <BooviAnimated animation="think" size="sm" />
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <BooviAnimated 
        animation="think" 
        size="lg" 
        showSparkles
      />
      <p className="text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
};
