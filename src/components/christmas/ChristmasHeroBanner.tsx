import { motion } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Sparkles } from "lucide-react";

export const ChristmasHeroBanner = () => {
  const { isChristmas, isChristmasDay, daysUntilChristmas } = useSeasonal();

  if (!isChristmas) return null;

  const getMessage = () => {
    if (isChristmasDay) {
      return "Merry Christmas! 🎄";
    }
    if (daysUntilChristmas === 1) {
      return "Christmas Eve! ✨";
    }
    return "Your Christmas Movie Helper";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Premium gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, hsl(120 32% 22%) 0%, hsl(120 35% 16%) 50%, hsl(125 38% 12%) 100%)",
        }}
      />
      
      {/* Animated snow particles inside card */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: -10,
              opacity: 0 
            }}
            animate={{ 
              y: "110%",
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Decorative glows */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[hsl(var(--christmas-gold))] opacity-15 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[hsl(var(--christmas-cream))] opacity-10 blur-3xl rounded-full" />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-center gap-5">
        {/* Boovi with glow */}
        <motion.div 
          className="relative flex-shrink-0"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-30 blur-2xl scale-150" />
          <ChristmasBoovi size="lg" showGlow={false} animate={false} />
        </motion.div>
        
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-[hsl(var(--christmas-gold))]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--christmas-gold))]">
              Christmas Edition
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-[hsl(var(--christmas-cream))] leading-tight drop-shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getMessage()}
          </motion.h2>
          
          <motion.p 
            className="text-sm text-[hsl(var(--christmas-beige))] mt-2 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Hot chocolate & movie night ☕🍿
          </motion.p>
        </div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute bottom-3 right-4 flex gap-1.5 opacity-40">
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-red))]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-gold))]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-cream))]" />
      </div>
    </motion.div>
  );
};
