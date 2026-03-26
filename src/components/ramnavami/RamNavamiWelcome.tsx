import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviRamNavami from "@/assets/boovi-ramnavami.png";

const STORAGE_KEY = "moviemend_ramnavami_welcome_2026";

const STAGES = [
  { duration: 1200 }, // Stage 1: Calm entry
  { duration: 1500 }, // Stage 2: Warm greeting
  { duration: 1200 }, // Stage 3: Engaged
  { duration: 1600 }, // Stage 4: Yay / guided
];

export const RamNavamiWelcome = () => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
    }
  }, []);

  // Stage progression
  useEffect(() => {
    if (!show) return;
    if (stage >= STAGES.length) {
      // All stages done — begin exit
      const exit = setTimeout(() => {
        setShow(false);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 600);
      return () => clearTimeout(exit);
    }
    const timer = setTimeout(() => setStage((s) => s + 1), STAGES[stage].duration);
    return () => clearTimeout(timer);
  }, [show, stage]);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onClick={dismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
          style={{
            background: "linear-gradient(175deg, #F4C27A 0%, #FFF6E8 60%, #FFF9F0 100%)",
          }}
        >
          {/* ── Floating particles (stage >= 0) ── */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: stage >= 0 ? [0, 0.25, 0] : 0,
                y: stage >= 0 ? [20, -60, -120] : 20,
              }}
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.35,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                left: `${8 + (i * 7.5) % 84}%`,
                top: `${50 + (i % 5) * 10}%`,
                background: "hsl(42 85% 65% / 0.5)",
              }}
            />
          ))}

          {/* ── Vignette (stage >= 2) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 0.35 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, hsl(25 30% 15% / 0.25) 100%)",
            }}
          />

          {/* ── Spotlight glow (stage >= 2) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: stage >= 1 ? (stage >= 2 ? 0.55 : 0.35) : 0,
              scale: stage >= 2 ? 1.15 : 1,
            }}
            transition={{ duration: 1.2 }}
            className="absolute w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(42 85% 65% / 0.5) 0%, hsl(42 70% 60% / 0.15) 50%, transparent 70%)",
            }}
          />

          {/* ── Boovi (stage >= 1) ── */}
          <motion.img
            src={booviRamNavami}
            alt="Boovi in kurta"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{
              opacity: stage >= 1 ? 1 : 0,
              scale: stage >= 2 ? 1.04 : stage >= 1 ? 1 : 0.88,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-40 h-40 object-contain relative z-10"
          />

          {/* ── Text area ── */}
          <div className="relative z-10 text-center mt-6 px-8 min-h-[120px] flex flex-col items-center justify-center">
            {/* Stage 2 — Warm greeting */}
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="stage-warm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "hsl(25 40% 22%)" }}
                  >
                    Happy Ram Navami 🪔
                  </h2>
                  <p
                    className="text-base mt-2"
                    style={{ color: "hsl(25 30% 35%)" }}
                  >
                    Wishing you joy, peace, and happiness.
                  </p>
                </motion.div>
              )}

              {/* Stage 3 — Engaged / curious */}
              {stage === 2 && (
                <motion.div
                  key="stage-engaged"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                >
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "hsl(25 38% 24%)" }}
                  >
                    Boovi has something special for you today
                  </p>
                </motion.div>
              )}

              {/* Stage 4 — Yay / guided */}
              {stage >= 3 && (
                <motion.div
                  key="stage-yay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                >
                  <p
                    className="text-base font-medium"
                    style={{ color: "hsl(25 35% 28%)" }}
                  >
                    Celebrate the day in your own way 🙏
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "hsl(25 25% 42%)" }}
                  >
                    And when you're ready, let's find something meaningful to
                    watch.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tap hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 0.45 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-10 text-xs"
            style={{ color: "hsl(25 30% 40%)" }}
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
