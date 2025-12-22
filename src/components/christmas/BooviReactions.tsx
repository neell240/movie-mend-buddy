import { useState, useCallback } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";
import booviPopcorn from "@/assets/boovi-christmas-popcorn.png";

export type BooviReaction = 
  | "wave" 
  | "laugh" 
  | "shocked" 
  | "sneaky" 
  | "cozy" 
  | "celebrate" 
  | "idle";

interface BooviReactionOverlayProps {
  reaction: BooviReaction;
  onComplete?: () => void;
  className?: string;
}

const reactionEmojis: Record<BooviReaction, string> = {
  wave: "👋",
  laugh: "😂",
  shocked: "😱",
  sneaky: "😏",
  cozy: "☕",
  celebrate: "🎉",
  idle: "",
};

const reactionAnimations: Record<BooviReaction, TargetAndTransition> = {
  wave: {
    rotate: [0, -15, 15, -15, 15, 0],
    y: [0, -5, 0],
  },
  laugh: {
    scale: [1, 1.1, 1, 1.1, 1],
    rotate: [0, -3, 3, -3, 0],
  },
  shocked: {
    scale: [1, 1.2, 0.95, 1.1, 1],
    y: [0, -20, 0],
  },
  sneaky: {
    x: [0, 5, 0, -5, 0],
    rotate: [0, 5, 0, -5, 0],
  },
  cozy: {
    y: [0, -3, 0],
    scale: [1, 1.02, 1],
  },
  celebrate: {
    y: [0, -25, 0],
    rotate: [0, -10, 10, -10, 10, 0],
    scale: [1, 1.15, 1],
  },
  idle: {
    y: [0, -6, 0],
  },
};

export const BooviReactionOverlay = ({ 
  reaction, 
  onComplete,
  className 
}: BooviReactionOverlayProps) => {
  const emoji = reactionEmojis[reaction];
  const animation = reactionAnimations[reaction];

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      animate={animation}
      transition={{ 
        duration: reaction === "idle" ? 3 : 1.5, 
        repeat: reaction === "idle" ? Infinity : 0,
        ease: "easeInOut",
      }}
      onAnimationComplete={() => {
        if (reaction !== "idle" && onComplete) {
          onComplete();
        }
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-25 blur-xl scale-150 -z-10" />
      
      {/* Boovi image */}
      <img
        src={booviPopcorn}
        alt="Boovi"
        className="w-24 h-24 object-contain"
      />
      
      {/* Reaction emoji bubble */}
      <AnimatePresence>
        {emoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-4 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-lg">{emoji}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Movie-specific reactions
export const movieReactions: Record<number, BooviReaction> = {
  771: "shocked",     // Home Alone
  10719: "laugh",     // Elf
  13183: "shocked",   // Polar Express (amazed)
  854: "sneaky",      // Nightmare Before Christmas
  508965: "cozy",     // Klaus
  12536: "celebrate", // Santa Clause
  14574: "laugh",     // Muppet Christmas Carol
};

export const useBooviReaction = () => {
  const [currentReaction, setCurrentReaction] = useState<BooviReaction>("idle");
  const [isReacting, setIsReacting] = useState(false);

  const triggerReaction = useCallback((reaction: BooviReaction) => {
    if (isReacting) return;
    
    setIsReacting(true);
    setCurrentReaction(reaction);
    
    setTimeout(() => {
      setCurrentReaction("idle");
      setIsReacting(false);
    }, 1500);
  }, [isReacting]);

  const getMovieReaction = useCallback((movieId: number) => {
    return movieReactions[movieId] || "celebrate";
  }, []);

  return {
    currentReaction,
    isReacting,
    triggerReaction,
    getMovieReaction,
  };
};
