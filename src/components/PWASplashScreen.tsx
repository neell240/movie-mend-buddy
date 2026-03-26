import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviImage from "@/assets/boovi-loading.png";

interface PWASplashScreenProps {
  onComplete?: () => void;
  minDisplayTime?: number;
}

export const PWASplashScreen = ({ 
  onComplete, 
  minDisplayTime = 2000 
}: PWASplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 safe-area-inset"
          style={{
            background: "linear-gradient(155deg, hsl(355 45% 14%) 0%, hsl(355 40% 10%) 50%, hsl(355 38% 8%) 100%)",
          }}
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-15"
              style={{ background: "hsl(42 85% 60%)" }}
            />
          </div>

          {/* Boovi Character */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
            className="relative mb-4 sm:mb-6"
          >
            <motion.img
              src={booviImage}
              alt="Boovi - Your Movie Buddy"
              className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Gold sparkles */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  background: "hsl(42 85% 60%)",
                }}
                animate={{
                  x: [0, Math.cos(i * 90 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 90 * Math.PI / 180) * 60],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* App Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(42 85% 65%), hsl(42 70% 80%), hsl(42 85% 60%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MovieMend
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center"
            style={{ color: "hsl(45 50% 85%)" }}
          >
            Your AI Movie Buddy 🎬
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-1.5 sm:gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ background: "hsl(42 85% 60%)" }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
