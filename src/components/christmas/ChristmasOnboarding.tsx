import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Button } from "@/components/ui/button";
import { Snowfall } from "./Snowfall";
import { Gift, Users, Sparkles, Film } from "lucide-react";

const ONBOARDING_KEY = "moviemend_christmas_onboarding_2024";

interface ChristmasOnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    id: 1,
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <ChristmasBoovi size="xl" showGlow animate />
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[hsl(var(--christmas-cream))]">
            Hi! I'm Boovi 👻🎄
          </h1>
          <p className="text-lg text-[hsl(var(--christmas-cream))] opacity-90">
            I'll help you find the perfect Christmas movie.
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
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[hsl(var(--christmas-cream))] to-[hsl(var(--christmas-beige))] flex items-center justify-center shadow-2xl">
            <Film className="w-16 h-16 text-[hsl(var(--christmas-pine))]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[hsl(var(--christmas-gold))] rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[hsl(var(--christmas-cream))]">
            Find Movies You'll Love
          </h1>
          <p className="text-lg text-[hsl(var(--christmas-cream))] opacity-90 max-w-xs">
            MovieMend helps you choose the best movies — no scrolling, no stress.
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
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[hsl(var(--christmas-red))] to-[hsl(var(--christmas-wine))] flex items-center justify-center shadow-2xl">
            <Gift className="w-16 h-16 text-white" />
          </div>
          <motion.div 
            className="absolute -bottom-2 -left-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChristmasBoovi size="sm" showGlow={false} />
          </motion.div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[hsl(var(--christmas-cream))]">
            Daily Christmas Picks 🎁
          </h1>
          <p className="text-lg text-[hsl(var(--christmas-cream))] opacity-90 max-w-xs">
            Every day, I'll pick a special Christmas movie just for you.
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
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[hsl(var(--christmas-forest))] to-[hsl(var(--christmas-pine))] flex items-center justify-center shadow-2xl">
            <Users className="w-16 h-16 text-[hsl(var(--christmas-cream))]" />
          </div>
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-[hsl(var(--christmas-cream))] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl">✨</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[hsl(var(--christmas-cream))]">
            Watch Together
          </h1>
          <p className="text-lg text-[hsl(var(--christmas-cream))] opacity-90 max-w-xs">
            Watch with friends, chat, react, and make movie nights magical ✨
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
          background: "linear-gradient(165deg, hsl(120 32% 18%) 0%, hsl(120 35% 14%) 40%, hsl(125 38% 10%) 100%)",
        }}
      >
        <Snowfall />
        
        {/* Decorative glows */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-[hsl(var(--christmas-gold))] opacity-10 blur-3xl rounded-full" />
        <div className="absolute bottom-32 right-10 w-60 h-60 bg-[hsl(var(--christmas-red))] opacity-10 blur-3xl rounded-full" />
        
        <div className="relative z-10 w-full max-w-md px-6 py-10">
          {/* Screen content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px] flex items-center justify-center"
            >
              {screens[currentScreen].content}
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {screens.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen 
                    ? "w-8 bg-[hsl(var(--christmas-gold))]" 
                    : "w-2 bg-[hsl(var(--christmas-cream))] opacity-30"
                }`}
                animate={{ scale: index === currentScreen ? 1 : 0.8 }}
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
              className="w-full py-6 text-lg font-semibold rounded-2xl bg-[hsl(var(--christmas-red))] hover:bg-[hsl(var(--christmas-wine))] text-white cta-glow transition-all"
              size="lg"
            >
              {currentScreen === screens.length - 1 ? "Let's start 🎄🍿" : "Next"}
            </Button>
          </motion.div>

          {/* Skip button */}
          {currentScreen < screens.length - 1 && (
            <button
              onClick={handleComplete}
              className="w-full mt-4 text-sm text-[hsl(var(--christmas-cream))] opacity-60 hover:opacity-100 transition-opacity"
            >
              Skip intro
            </button>
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
