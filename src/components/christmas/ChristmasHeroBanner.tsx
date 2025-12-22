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

  const getSubtitle = () => {
    if (isChristmasDay) {
      return "Time for holiday movies & magic ✨";
    }
    if (daysUntilChristmas <= 3) {
      return `${daysUntilChristmas} days to go! ☕🍿`;
    }
    return "Hot chocolate & movie night ☕🍿";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden hero-glass"
    >
      {/* Animated snow particles inside card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${5 + Math.random() * 90}%`,
              opacity: 0.4 + Math.random() * 0.3,
            }}
            initial={{ y: -10 }}
            animate={{ 
              y: "120%",
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Warm gold corner glow */}
      <div 
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(circle, hsl(30 60% 75% / 0.2) 0%, transparent 70%)" 
        }}
      />
      <div 
        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.08) 0%, transparent 70%)" 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-center gap-5">
        {/* Boovi with warm glow */}
        <motion.div 
          className="relative flex-shrink-0"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Warm golden glow behind Boovi */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl scale-150"
            style={{
              background: "radial-gradient(circle, hsl(30 60% 75% / 0.35) 0%, transparent 70%)"
            }}
          />
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
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--christmas-gold))]" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--christmas-gold))]">
              Christmas Edition
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-[hsl(var(--christmas-cream))] leading-tight"
            style={{ textShadow: "0 2px 10px hsl(120 32% 8% / 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getMessage()}
          </motion.h2>
          
          <motion.p 
            className="text-sm text-[hsl(var(--christmas-cream))] mt-2 opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4 }}
          >
            {getSubtitle()}
          </motion.p>
        </div>
      </div>
      
      {/* Bottom decorative dots */}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {[
          "hsl(0 67% 33%)",     // Santa red
          "hsl(30 60% 75%)",    // Warm gold
          "hsl(38 38% 93%)",    // Cream
        ].map((color, i) => (
          <motion.div 
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
};
