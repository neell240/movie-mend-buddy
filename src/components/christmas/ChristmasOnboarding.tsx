import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Button } from "@/components/ui/button";
import { Snowfall } from "./Snowfall";
import { Gift, Users, Sparkles, Film, Heart, Calendar } from "lucide-react";

const ONBOARDING_KEY = "moviemend_christmas_onboarding_2024";

interface ChristmasOnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    id: 1,
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChristmasBoovi size="xl" showGlow animate />
        </motion.div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">
            Hi! I'm Boovi 👻🎄
          </h1>
          <p className="text-lg text-white/85 max-w-xs">
            Your friendly movie companion for the holiday season.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <motion.div 
            className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(42, 50%, 96%) 0%, hsl(45, 55%, 92%) 100%)" }}
            whileHover={{ scale: 1.05 }}
          >
            <Film className="w-14 h-14 text-[hsl(355,72%,45%)]" />
          </motion.div>
          <motion.div 
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(355, 72%, 48%) 0%, hsl(355, 72%, 38%) 100%)" }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-white" />
          </motion.div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">
            Find Movies You'll Love
          </h1>
          <p className="text-lg text-white/85 max-w-xs">
            No endless scrolling. I'll recommend the perfect movies for you.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <motion.div 
            className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(355, 72%, 48%) 0%, hsl(355, 72%, 38%) 100%)" }}
            animate={{ 
              boxShadow: [
                "0 20px 50px -15px hsl(355 72% 45% / 0.3)",
                "0 20px 60px -15px hsl(355 72% 45% / 0.5)",
                "0 20px 50px -15px hsl(355 72% 45% / 0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gift className="w-14 h-14 text-white" />
          </motion.div>
          <motion.div 
            className="absolute -bottom-3 -left-3"
            animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChristmasBoovi size="sm" showGlow={false} />
          </motion.div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">
            Daily Christmas Picks 🎁
          </h1>
          <p className="text-lg text-white/85 max-w-xs">
            Scratch to reveal a new Christmas movie every single day!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <motion.div 
            className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, hsl(42, 85%, 65%) 0%, hsl(42, 75%, 55%) 100%)" }}
          >
            <Users className="w-14 h-14 text-white" />
          </motion.div>
          <motion.div 
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "hsl(42, 50%, 96%)" }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-xl">✨</span>
          </motion.div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">
            Watch Together
          </h1>
          <p className="text-lg text-white/85 max-w-xs">
            Host movie nights with friends. Chat, react, and make memories!
          </p>
        </div>
      </div>
    ),
  },
];

export const ChristmasOnboarding = ({ onComplete }: ChristmasOnboardingProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{
          background: "linear-gradient(175deg, hsl(355 55% 22%) 0%, hsl(355 50% 16%) 50%, hsl(355 48% 14%) 100%)",
        }}
      >
        <Snowfall />
        
        {/* Decorative glows */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-[hsl(42,85%,65%)] opacity-15 blur-3xl rounded-full" />
        <div className="absolute bottom-40 right-10 w-48 h-48 bg-[hsl(355,72%,45%)] opacity-12 blur-3xl rounded-full" />
        
        <div className="relative z-10 w-full max-w-md px-6 py-10">
          {/* Screen content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-h-[380px] flex items-center justify-center"
            >
              {screens[currentScreen].content}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {screens.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentScreen(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentScreen 
                    ? "w-8" 
                    : "w-2.5"
                }`}
                style={{
                  background: index === currentScreen 
                    ? "linear-gradient(90deg, hsl(355, 72%, 48%), hsl(355, 72%, 40%))"
                    : "hsl(0 0% 100% / 0.25)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleNext}
              className="w-full py-6 text-lg font-semibold rounded-2xl text-white cta-glow"
              size="lg"
            >
              {currentScreen === screens.length - 1 ? "Let's start 🎄🍿" : "Continue"}
            </Button>
          </motion.div>

          {/* Skip button */}
          {currentScreen < screens.length - 1 && (
            <motion.button
              onClick={handleComplete}
              className="w-full mt-4 text-sm text-white/50 hover:text-white/80 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Skip intro
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const useChristmasOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  return {
    showOnboarding,
    completeOnboarding: () => setShowOnboarding(false),
  };
};
