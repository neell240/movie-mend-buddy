import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import booviRamNavami from "@/assets/boovi-ramnavami.png";

const STORAGE_KEY = "moviemend_ramnavami_welcome_2026";

export const RamNavamiWelcome = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={dismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(175deg, #F4C27A 0%, #FFF6E8 60%, #FFF9F0 100%)",
          }}
        >
          {/* Subtle gold glow behind Boovi */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(42 85% 65% / 0.5) 0%, transparent 70%)",
            }}
          />

          {/* Boovi kurta */}
          <motion.img
            src={booviRamNavami}
            alt="Boovi in kurta"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-40 h-40 object-contain relative z-10"
          />

          {/* Greeting text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="text-center mt-6 px-8 relative z-10"
          >
            <h2 className="text-2xl font-bold" style={{ color: "hsl(25 40% 22%)" }}>
              Happy Ram Navami 🙏
            </h2>
            <p className="text-base mt-2" style={{ color: "hsl(25 30% 35%)" }}>
              Wishing you and your family peace and happiness.
            </p>
            <p className="text-sm mt-3" style={{ color: "hsl(25 25% 45%)" }}>
              Would you like something meaningful to watch today?
            </p>
          </motion.div>

          {/* Tap hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.5 }}
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
