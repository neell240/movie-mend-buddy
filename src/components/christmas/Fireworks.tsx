import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: { angle: number; distance: number; size: number }[];
}

const COLORS = [
  "hsl(43, 90%, 55%)",   // Gold
  "hsl(220, 80%, 60%)",  // Midnight blue
  "hsl(220, 10%, 80%)",  // Silver
  "hsl(355, 75%, 50%)",  // Red
  "hsl(280, 70%, 60%)",  // Purple
];

const createParticles = () => {
  const particles = [];
  const count = 12 + Math.floor(Math.random() * 8);
  for (let i = 0; i < count; i++) {
    particles.push({
      angle: (360 / count) * i + Math.random() * 20 - 10,
      distance: 40 + Math.random() * 60,
      size: 3 + Math.random() * 4,
    });
  }
  return particles;
};

export const Fireworks = () => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    const launchFirework = () => {
      const newFirework: Firework = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        particles: createParticles(),
      };

      setFireworks((prev) => [...prev, newFirework]);

      // Remove firework after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== newFirework.id));
      }, 1500);
    };

    // Initial burst
    setTimeout(launchFirework, 500);
    setTimeout(launchFirework, 800);

    // Continuous fireworks
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        launchFirework();
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {fireworks.map((firework) => (
          <motion.div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Center flash */}
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: firework.color }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Particles */}
            {firework.particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: firework.color,
                  boxShadow: `0 0 6px ${firework.color}, 0 0 12px ${firework.color}`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                  y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Trailing sparkles */}
            {firework.particles.slice(0, 6).map((particle, i) => (
              <motion.div
                key={`trail-${i}`}
                className="absolute w-1 h-1 rounded-full bg-white/80"
                initial={{ x: 0, y: 0, opacity: 0.8 }}
                animate={{
                  x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance * 0.6,
                  y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance * 0.6 + 20,
                  opacity: 0,
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.1,
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
