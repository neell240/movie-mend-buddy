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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a0a] via-[#2d1010] to-[#1a0a0a] overflow-hidden"
        >
          {/* Christmas decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Snowflakes */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 0.4 + Math.random() * 0.6
                }}
                animate={{
                  y: window.innerHeight + 20,
                  x: `+=${(Math.random() - 0.5) * 100}`,
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
                style={{
                  width: 2 + Math.random() * 4,
                  height: 2 + Math.random() * 4,
                }}
              />
            ))}

            {/* Christmas lights */}
            <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 py-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-4 rounded-full"
                  style={{
                    backgroundColor: ['#ff4444', '#44ff44', '#ffaa00', '#4444ff', '#ff44ff'][i % 5],
                    boxShadow: `0 0 10px ${['#ff4444', '#44ff44', '#ffaa00', '#4444ff', '#ff44ff'][i % 5]}`
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
            className="relative mb-6"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full scale-150" />
            
            <motion.img
              src={booviImage}
              alt="Boovi - Your Movie Buddy"
              className="relative w-48 h-48 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sparkles around Boovi */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
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
            className="text-4xl font-bold bg-gradient-to-r from-red-400 via-white to-green-400 bg-clip-text text-transparent mb-2"
          >
            MovieMend
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Your AI Movie Buddy 🎬
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{
                  y: [0, -12, 0],
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

          {/* Christmas greeting */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 text-sm text-muted-foreground"
          >
            🎄 Merry Christmas & Happy Watching! 🎄
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
