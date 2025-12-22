import { motion } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Sparkles, Snowflake } from "lucide-react";

export const ChristmasHeroBanner = () => {
  const { isChristmas, isChristmasDay, daysUntilChristmas } = useSeasonal();

  if (!isChristmas) return null;

  const getMessage = () => {
    if (isChristmasDay) return "Merry Christmas! 🎄";
    if (daysUntilChristmas === 1) return "Christmas Eve! ✨";
    return "Your Christmas Movie Helper";
  };

  const getSubtitle = () => {
    if (isChristmasDay) return "Time for holiday movies & magic ✨";
    if (daysUntilChristmas <= 3) return `${daysUntilChristmas} days to go!`;
    return "Hot chocolate & movie night ☕🍿";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden hero-glass"
    >
      {/* Animated snow inside card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${8 + Math.random() * 84}%`,
              opacity: 0.5 + Math.random() * 0.3,
            }}
            initial={{ y: -5 }}
            animate={{ y: "120%" }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Warm gold glow */}
      <div 
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl"
        style={{ 
          background: "radial-gradient(circle, hsl(42 85% 65% / 0.25) 0%, transparent 70%)" 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6 flex items-center gap-5">
        {/* Boovi with float animation */}
        <motion.div 
          className="relative flex-shrink-0"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Gold glow behind */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl scale-150"
            style={{
              background: "radial-gradient(circle, hsl(42 85% 65% / 0.35) 0%, transparent 70%)"
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
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(42,85%,65%)]" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(42,85%,65%)]">
              Christmas Edition
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-[hsl(45,60%,96%)] leading-tight"
            style={{ textShadow: "0 2px 12px hsl(355 50% 8% / 0.4)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getMessage()}
          </motion.h2>
          
          <motion.p 
            className="text-sm text-[hsl(42,45%,85%)] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getSubtitle()}
          </motion.p>
        </div>

        {/* Decorative snowflake */}
        <motion.div
          className="hidden sm:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Snowflake className="w-8 h-8 text-white/20" />
        </motion.div>
      </div>
      
      {/* Bottom accent dots */}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {[
          "hsl(355 72% 45%)",
          "hsl(42 85% 65%)",
          "hsl(42 50% 96%)",
        ].map((color, i) => (
          <motion.div 
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
          />
        ))}
      </div>
    </motion.div>
  );
};
