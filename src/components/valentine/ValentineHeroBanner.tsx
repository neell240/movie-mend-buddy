import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import booviAvatar from "@/assets/boovi-avatar.png";
import novaAvatar from "@/assets/nova-avatar.png";

const getValentineDayLabel = (): string => {
  const day = new Date().getDate();
  const month = new Date().getMonth();
  if (month !== 1) return "Valentine's Week";
  switch (day) {
    case 7: return "Rose Day 🌹";
    case 8: return "Propose Day 💍";
    case 9: return "Chocolate Day 🍫";
    case 10: return "Teddy Day 🧸";
    case 11: return "Promise Day 🤞";
    case 12: return "Hug Day 🤗";
    case 13: return "Kiss Day 💋";
    case 14: return "Valentine's Day";
    default: return "Valentine's Week";
  }
};

export const ValentineHeroBanner = () => {
  const dayLabel = getValentineDayLabel();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(350 40% 14%) 0%, hsl(345 45% 18%) 50%, hsl(340 35% 13%) 100%)",
        boxShadow: "0 8px 32px -8px hsl(350 40% 8% / 0.5)",
        border: "1px solid hsl(40 50% 50% / 0.15)",
      }}
    >
      {/* Subtle decorative hearts */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white fill-white"
            style={{
              left: `${(i * 18) % 100}%`,
              top: `${(i * 20) % 100}%`,
              width: 16 + (i % 3) * 8,
              height: 16 + (i % 3) * 8,
              transform: `rotate(${i * 25}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 flex items-center gap-4">
        {/* Boovi & Nova together */}
        <motion.div
          className="relative flex items-end -space-x-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={booviAvatar}
            alt="Boovi"
            className="w-16 h-16 object-contain drop-shadow-lg relative z-10"
          />
          <motion.img
            src={novaAvatar}
            alt="Nova"
            className="w-14 h-14 object-contain drop-shadow-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          {/* Single floating heart */}
          <motion.div
            className="absolute -top-2 left-1/2 text-sm"
            animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            💕
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(40 70% 60%)" }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "hsl(40 60% 65%)" }}
            >
              {dayLabel}
            </span>
          </div>
          <h2 className="text-lg font-bold mb-0.5" style={{ color: "hsl(40 50% 94%)", fontFamily: "Georgia, serif" }}>
            Movie night, sorted.
          </h2>
          <p className="text-xs" style={{ color: "hsl(350 25% 65%)" }}>
            Boovi & Nova picked tonight's best for you
          </p>
        </div>
      </div>

      {/* Gold shimmer accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(40 70% 60% / 0.06) 50%, transparent 100%)",
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
      />
    </motion.div>
  );
};
