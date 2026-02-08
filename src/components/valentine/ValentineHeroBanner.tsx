import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import booviAvatar from "@/assets/boovi-avatar.png";

export const ValentineHeroBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(350 55% 45%) 0%, hsl(340 55% 38%) 50%, hsl(330 50% 35%) 100%)",
        boxShadow: "0 8px 32px -8px hsl(350 60% 40% / 0.4)",
      }}
    >
      {/* Decorative hearts pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white fill-white"
            style={{
              left: `${(i * 9) % 100}%`,
              top: `${(i * 13) % 100}%`,
              width: 20 + (i % 3) * 10,
              height: 20 + (i % 3) * 10,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 flex items-center gap-4">
        {/* Boovi with hearts */}
        <motion.div 
          className="relative"
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src={booviAvatar} 
            alt="Boovi" 
            className="w-20 h-20 object-contain drop-shadow-lg" 
          />
          {/* Floating hearts around Boovi */}
          <motion.div
            className="absolute -top-2 -right-1 text-lg"
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          >
            💕
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2 text-sm"
            animate={{ 
              y: [0, -6, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            ❤️
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-rose-200" />
            <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider">
              Valentine's Week
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Fall in Love with Movies 💕
          </h2>
          <p className="text-sm text-rose-100/80">
            Discover a new romantic classic every day this week
          </p>
        </div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(350 80% 80% / 0.1) 50%, transparent 100%)",
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
