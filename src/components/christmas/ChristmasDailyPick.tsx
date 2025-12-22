import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Sparkles, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Christmas movies for each day of December (22-31)
const CHRISTMAS_MOVIES = [
  { id: 9647, title: "Scrooged", year: 1988 },
  { id: 508965, title: "Klaus", year: 2019 },
  { id: 10719, title: "Elf", year: 2003 },
  { id: 771, title: "Home Alone", year: 1990 },
  { id: 13183, title: "The Polar Express", year: 2004 },
  { id: 823758, title: "Spirited", year: 2022 },
  { id: 772071, title: "A Boy Called Christmas", year: 2021 },
  { id: 14574, title: "The Muppet Christmas Carol", year: 1992 },
  { id: 11970, title: "Miracle on 34th Street", year: 1947 },
  { id: 12536, title: "The Santa Clause", year: 1994 },
];

const REVEAL_KEY = "moviemend_christmas_daily_reveal";

export const ChristmasDailyPick = () => {
  const navigate = useNavigate();
  const { isChristmas, daysUntilChristmas, isChristmasDay } = useSeasonal();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBooviReaction, setShowBooviReaction] = useState(false);

  // Get today's movie based on date
  const today = new Date();
  const dayIndex = today.getDate() - 22; // Dec 22 = index 0
  const todayMovie = CHRISTMAS_MOVIES[Math.max(0, Math.min(dayIndex, CHRISTMAS_MOVIES.length - 1))];

  useEffect(() => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    const wasRevealed = localStorage.getItem(todayKey);
    if (wasRevealed) {
      setIsRevealed(true);
    }
  }, []);

  if (!isChristmas) return null;

  const handleReveal = () => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    localStorage.setItem(todayKey, "true");
    setShowConfetti(true);
    
    setTimeout(() => {
      setIsRevealed(true);
      setShowBooviReaction(true);
    }, 400);
    
    setTimeout(() => {
      setShowConfetti(false);
      setShowBooviReaction(false);
    }, 3500);
  };

  const getCountdownText = () => {
    if (isChristmasDay) return "Merry Christmas! 🎄";
    if (daysUntilChristmas === 1) return "Christmas Eve!";
    return `${daysUntilChristmas} days left ✨`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="relative"
    >
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 -top-10 -left-4 -right-4">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: [
                    'hsl(38 38% 93%)',  // Cream
                    'hsl(0 67% 33%)',    // Santa red
                    'hsl(30 60% 75%)',   // Warm gold
                    'hsl(120 28% 26%)',  // Pine
                  ][i % 4],
                  width: 6 + Math.random() * 6 + 'px',
                  height: 6 + Math.random() * 6 + 'px',
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
                animate={{ 
                  y: 450, 
                  opacity: [1, 1, 0], 
                  rotate: 360 + Math.random() * 360,
                  x: (Math.random() - 0.5) * 180,
                  scale: [1, 1, 0.5],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2.5 + Math.random() * 1.5, 
                  ease: "easeOut",
                  delay: Math.random() * 0.4,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main card - premium cream */}
      <div className="relative cozy-card overflow-hidden">
        {/* Gold shimmer overlay */}
        <div className="absolute inset-0 gold-shimmer opacity-50 pointer-events-none" />
        
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(120 32% 16%) 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Gift icon with glow */}
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, hsl(0 67% 38%) 0%, hsl(0 67% 28%) 100%)",
                  boxShadow: "0 4px 15px hsl(0 67% 33% / 0.35)",
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Gift className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-sm font-bold text-[hsl(120,32%,16%)]">
                  Today's Movie Pick
                </span>
                <p className="text-xs text-[hsl(120,28%,35%)]">
                  December {today.getDate()}
                </p>
              </div>
            </div>
            
            {/* Countdown badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "linear-gradient(135deg, hsl(120 28% 26% / 0.15) 0%, hsl(120 28% 20% / 0.1) 100%)",
                color: "hsl(120 28% 30%)",
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{getCountdownText()}</span>
            </div>
          </div>

          {/* Movie reveal area */}
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="text-center py-8"
              >
                {/* Gift box icon with pulsing glow */}
                <motion.div 
                  className="w-24 h-24 mx-auto mb-5 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: "linear-gradient(145deg, hsl(0 67% 36%) 0%, hsl(0 67% 28%) 100%)",
                  }}
                  animate={{ 
                    boxShadow: [
                      "0 12px 35px -8px hsl(0 67% 33% / 0.35)",
                      "0 16px 50px -8px hsl(0 67% 33% / 0.5)",
                      "0 12px 35px -8px hsl(0 67% 33% / 0.35)",
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gift className="w-12 h-12 text-white" />
                  
                  {/* Sparkle decorations */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-[hsl(30,60%,65%)]" />
                  </motion.div>
                </motion.div>
                
                <p className="text-[hsl(120,28%,35%)] mb-5 text-sm font-medium">
                  Tap to unwrap today's Christmas movie! 🎁
                </p>
                
                <Button
                  onClick={handleReveal}
                  size="lg"
                  className="rounded-xl px-8 py-6 font-semibold text-white cta-glow animate-pulse-glow"
                  style={{
                    background: "linear-gradient(135deg, hsl(0 67% 36%) 0%, hsl(0 67% 30%) 100%)",
                  }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reveal Today's Pick
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="flex items-center gap-5"
              >
                {/* Movie poster placeholder */}
                <motion.div 
                  className="w-28 h-40 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, hsl(120 32% 22%) 0%, hsl(120 35% 16%) 100%)",
                    boxShadow: "0 8px 25px -8px hsl(120 32% 10% / 0.5)",
                  }}
                  onClick={() => navigate(`/movie/${todayMovie.id}`)}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Film className="w-8 h-8 text-[hsl(38,38%,85%)] mb-2" />
                  <span className="text-3xl">🎬</span>
                  
                  {/* Snow pile at bottom */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-3 rounded-t-full"
                    style={{ background: "hsl(0 0% 100% / 0.15)" }}
                  />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span className="text-xs font-medium text-[hsl(0,67%,33%)] uppercase tracking-wider">
                      🎄 Christmas Classic
                    </span>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-[hsl(120,32%,15%)] mb-1 leading-tight"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {todayMovie.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm text-[hsl(120,28%,40%)] mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {todayMovie.year}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={() => navigate(`/movie/${todayMovie.id}`)}
                      className="rounded-xl font-medium text-white cta-glow"
                      style={{
                        background: "linear-gradient(135deg, hsl(0 67% 36%) 0%, hsl(0 67% 30%) 100%)",
                      }}
                    >
                      View Movie Details
                    </Button>
                  </motion.div>
                </div>

                {/* Boovi reaction - peeking from right */}
                <AnimatePresence>
                  {showBooviReaction && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, x: 30, rotate: 15 }}
                      animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0, x: 20 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute -right-3 -top-6"
                    >
                      <ChristmasBoovi size="sm" showGlow animate />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
