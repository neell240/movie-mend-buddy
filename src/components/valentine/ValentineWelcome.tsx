import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviAvatar from "@/assets/boovi-avatar.png";
import novaAvatar from "@/assets/nova-avatar.png";

const VALENTINE_WELCOME_KEY = "moviemend_valentine_welcome_2026";

interface ValentineGreeting {
  theme: string;
  emoji: string;
  booviLine: string;
  novaLine: string;
}

const getValentineGreeting = (): ValentineGreeting => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();

  if (month !== 1) {
    return { theme: "Valentine's Week", emoji: "💖", booviLine: "It's Valentine's week 💖", novaLine: "Tell us the mood—we'll handle the movie." };
  }

  switch (day) {
    case 7: return { theme: "Rose Day", emoji: "🌹", booviLine: "Happy Rose Day 🌹 A perfect night for a beautiful movie.", novaLine: "Something classic and timeless tonight?" };
    case 8: return { theme: "Propose Day", emoji: "💍", booviLine: "Happy Propose Day 💍 Big feelings deserve a big screen.", novaLine: "We've picked something unforgettable." };
    case 9: return { theme: "Chocolate Day", emoji: "🍫", booviLine: "Happy Chocolate Day 🍫 Ready for something sweet tonight?", novaLine: "Cozy, romantic, or just fun—we've got you." };
    case 10: return { theme: "Teddy Day", emoji: "🧸", booviLine: "Happy Teddy Day 🧸 Grab something soft, hit play.", novaLine: "Comfort movies are our specialty." };
    case 11: return { theme: "Promise Day", emoji: "🤞", booviLine: "Happy Promise Day 🤞 We promise—only great picks.", novaLine: "Every movie tonight is worth your time." };
    case 12: return { theme: "Hug Day", emoji: "🤗", booviLine: "Happy Hug Day 🤗 Nothing like a movie that makes you hold on tight.", novaLine: "Warm stories for a warm evening." };
    case 13: return { theme: "Kiss Day", emoji: "💋", booviLine: "Happy Kiss Day 💋 The best scenes are waiting.", novaLine: "Cinema's greatest moments, just for you." };
    case 14: return { theme: "Valentine's Day", emoji: "❤️", booviLine: "Happy Valentine's Day ❤️ Movie night just got easier.", novaLine: "Perfect picks for sharing the moment." };
    default: return { theme: "Valentine's Week", emoji: "💖", booviLine: "It's Valentine's week 💖", novaLine: "Tell us the mood—we'll handle the movie." };
  }
};

export const ValentineWelcome = () => {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState(0); // 0=bg, 1=characters, 2=text, 3=fadeout

  useEffect(() => {
    const seen = localStorage.getItem(VALENTINE_WELCOME_KEY);
    if (!seen) {
      setShow(true);
      // Phase timeline
      const t1 = setTimeout(() => setPhase(1), 400);   // characters slide in
      const t2 = setTimeout(() => setPhase(2), 1200);  // text appears
      const t3 = setTimeout(() => setPhase(3), 5500);  // fade out
      const t4 = setTimeout(() => {
        setShow(false);
        localStorage.setItem(VALENTINE_WELCOME_KEY, "true");
      }, 6500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, []);

  const handleSkip = () => {
    setPhase(3);
    setTimeout(() => {
      setShow(false);
      localStorage.setItem(VALENTINE_WELCOME_KEY, "true");
    }, 600);
  };

  const greeting = getValentineGreeting();

  if (!show) return null;

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleSkip}
          style={{
            background: "linear-gradient(155deg, hsl(350 40% 14%) 0%, hsl(345 45% 18%) 40%, hsl(350 35% 12%) 100%)",
          }}
        >
          {/* Slow floating hearts in background */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400/15 select-none"
              style={{
                left: `${10 + (i * 12) % 85}%`,
                top: `${15 + (i * 17) % 70}%`,
                fontSize: `${18 + (i % 3) * 8}px`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              ♥
            </motion.div>
          ))}

          <div className="flex flex-col items-center gap-6 px-8 max-w-sm">
            {/* Characters */}
            <div className="flex items-end gap-6">
              {/* Boovi slides from left */}
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative"
              >
                <motion.img
                  src={booviAvatar}
                  alt="Boovi"
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                  animate={phase >= 1 ? { y: [0, -4, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Nova slides from right */}
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={phase >= 1 ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
                className="relative"
              >
                <motion.img
                  src={novaAvatar}
                  alt="Nova"
                  className="w-22 h-22 object-contain drop-shadow-2xl"
                  style={{ width: 88, height: 88 }}
                  animate={phase >= 1 ? { y: [0, -3, 0] } : {}}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.div>
            </div>

            {/* Text content - line by line fade */}
            {phase >= 2 && (
              <div className="text-center space-y-4">
                {/* Day theme badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                  style={{
                    background: "hsl(350 50% 25% / 0.6)",
                    border: "1px solid hsl(350 40% 35% / 0.4)",
                  }}
                >
                  <span className="text-base">{greeting.emoji}</span>
                  <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "hsl(350 60% 80%)" }}>
                    {greeting.theme}
                  </span>
                </motion.div>

                {/* Boovi's line */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-lg font-semibold leading-relaxed"
                  style={{ color: "hsl(40 50% 94%)", fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {greeting.booviLine}
                </motion.p>

                {/* Nova's line */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="text-sm"
                  style={{ color: "hsl(350 30% 75%)" }}
                >
                  {greeting.novaLine}
                </motion.p>
              </div>
            )}

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 2 }}
              className="text-xs mt-4"
              style={{ color: "hsl(350 20% 60%)" }}
            >
              Tap anywhere to continue
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
