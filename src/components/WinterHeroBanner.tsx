import { motion } from "framer-motion";
import booviAvatar from "@/assets/boovi-avatar.png";

export const WinterHeroBanner = () => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden p-6 animate-gold-border"
      style={{
        background: "linear-gradient(135deg, hsl(355 45% 18% / 0.95), hsl(355 40% 22% / 0.9))",
        border: "1px solid hsl(42 50% 40% / 0.3)",
        boxShadow: "0 8px 32px hsl(355 50% 10% / 0.4)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(42 50% 50% / 0.4)" }}
          />
        ))}
      </div>
      <div className="absolute top-4 right-6 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(42 50% 50% / 0.4)" }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6 mt-4">
        {/* Boovi Avatar */}
        <motion.div
          className="relative flex-shrink-0 animate-gold-glow"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={booviAvatar}
            alt="Boovi"
            className="w-32 h-32 object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex-1">
          <motion.p
            className="text-xs font-semibold tracking-wider mb-2 animate-gold-glow"
            style={{ color: "hsl(42 85% 65%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ✨ MOVIE FINDER
          </motion.p>
          <motion.h2
            className="text-2xl font-bold leading-tight mb-3"
            style={{ color: "hsl(45 60% 96%)" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your Personal
            <br />
            <span className="gold-underline-shimmer">Movie</span>
            <br />
            Helper
          </motion.h2>
          <motion.p
            className="text-sm"
            style={{ color: "hsl(45 40% 80%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Find your next favorite film
          </motion.p>
        </div>
      </div>

      {/* Gold divider */}
      <div className="gold-divider mt-2" />

      {/* Pagination dots */}
      <div className="absolute bottom-4 right-6 flex gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "hsl(355 60% 50%)" }}
        />
        <div
          className="w-2 h-2 rounded-full animate-gold-glow"
          style={{ background: "hsl(42 70% 55%)" }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "hsl(45 30% 60% / 0.5)" }}
        />
      </div>
    </motion.div>
  );
};
