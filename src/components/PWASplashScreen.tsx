import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviImage from "@/assets/boovi-transparent.png";

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a0a] via-[#2d1010] to-[#1a0a0a] overflow-hidden px-4 safe-area-inset"
        >
          {/* Christmas decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Snowflakes - reduced count on mobile for performance */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/60 rounded-full"
                initial={{ 
                  x: `${Math.random() * 100}%`,
                  y: -20,
                  opacity: 0.4 + Math.random() * 0.6
                }}
                animate={{
                  y: '120vh',
                  x: `${Math.random() * 100}%`,
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                }}
              />
            ))}

            {/* Christmas lights - responsive count */}
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 sm:gap-3 md:gap-4 py-3 sm:py-4 px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-3 sm:w-3 sm:h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: ['#ff4444', '#44ff44', '#ffaa00', '#4444ff', '#ff44ff'][i % 5],
                    boxShadow: `0 0 8px ${['#ff4444', '#44ff44', '#ffaa00', '#4444ff', '#ff44ff'][i % 5]}`
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </div>
          </div>

          {/* Boovi Character - responsive sizing */}
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
            {/* Glow effect */}
            <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full scale-150" />
            
            <motion.img
              src={booviImage}
              alt="Boovi - Your Movie Buddy"
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sparkles around Boovi - fewer on mobile */}
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
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

          {/* App Name - responsive text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 via-white to-green-400 bg-clip-text text-transparent mb-1 sm:mb-2 text-center"
          >
            MovieMend
          </motion.h1>

          {/* Tagline - responsive text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center"
          >
            Your AI Movie Buddy 🎬
          </motion.p>

          {/* Loading indicator - responsive sizing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-1.5 sm:gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"
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

          {/* Christmas greeting - responsive positioning */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 text-xs sm:text-sm text-muted-foreground text-center px-4"
          >
            🎄 Merry Christmas & Happy Watching! 🎄
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
