import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviRamNavami from "@/assets/boovi-ramnavami.png";

const STORAGE_KEY = "moviemend_ramnavami_welcome_2026_v3";

export const RamNavamiWelcome = () => {
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timings = [800, 1000, 1200, 1400, 1600];
    if (stage >= timings.length) {
      const t = setTimeout(() => {
        setShow(false);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), timings[stage]);
    return () => clearTimeout(t);
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
            background: "linear-gradient(175deg, #F4C27A 0%, #FFF6E8 55%, #FFF9F0 100%)",
          }}
        >
          {/* Floating particles */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0], y: [30, -80, -160] }}
              transition={{
                duration: 4.5 + (i % 3),
                delay: 0.5 + i * 0.3,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 4) * 2,
                height: 3 + (i % 4) * 2,
                left: `${6 + ((i * 7) % 88)}%`,
                top: `${55 + (i % 6) * 8}%`,
                background: "hsl(42 80% 62% / 0.45)",
              }}
            />
          ))}

          {/* Vignette overlay – SPOTLIGHT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: `
                radial-gradient(ellipse 50% 55% at 50% 42%, transparent 0%, transparent 30%, hsl(25 35% 12% / 0.18) 60%, hsl(25 30% 8% / 0.4) 100%)
              `,
            }}
          />

          {/* Spotlight circle on Boovi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: stage >= 2 ? 0.6 : stage >= 1 ? 0.3 : 0,
              scale: stage >= 2 ? 1.2 : 1,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-80 h-80 rounded-full z-[2]"
            style={{
              background:
                "radial-gradient(circle, hsl(42 90% 68% / 0.45) 0%, hsl(42 75% 60% / 0.12) 50%, transparent 72%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -58%)",
            }}
          />

          {/* Boovi */}
          <motion.img
            src={booviRamNavami}
            alt="Boovi in kurta"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: stage >= 1 ? 1 : 0,
              scale: stage >= 2 ? 1.05 : stage >= 1 ? 1 : 0.92,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-44 h-44 object-contain relative z-10"
          />

          {/* Text sequence */}
          <div className="relative z-10 text-center mt-5 px-8 min-h-[130px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold" style={{ color: "hsl(25 40% 22%)" }}>
                    Happy Ram Navami 🪔
                  </h2>
                </motion.div>
              )}
              {stage === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold" style={{ color: "hsl(25 40% 22%)" }}>
                    Happy Ram Navami 🪔
                  </h2>
                  <p className="text-base mt-2" style={{ color: "hsl(25 30% 35%)" }}>
                    Wishing you joy, peace, and happiness.
                  </p>
                </motion.div>
              )}
              {stage === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg font-semibold" style={{ color: "hsl(25 38% 24%)" }}>
                    Boovi has something special for you today
                  </p>
                </motion.div>
              )}
              {stage >= 4 && (
                <motion.div
                  key="s4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-base font-medium" style={{ color: "hsl(25 35% 28%)" }}>
                    Celebrate the day in your own way 🙏
                  </p>
                  <p className="text-sm mt-2" style={{ color: "hsl(25 25% 42%)" }}>
                    And when you're ready, let's find something meaningful to watch.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tap hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 0.4 : 0 }}
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
