import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { Button } from "@/components/ui/button";
import { Heart, Film, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import booviAvatar from "@/assets/boovi-avatar.png";

// Romantic movies for Valentine's week (Feb 8-14)
const VALENTINE_MOVIES = [
  { id: 11036, title: "The Notebook", year: 2004 }, // Feb 8
  { id: 597, title: "Titanic", year: 1997 }, // Feb 9
  { id: 332562, title: "A Star Is Born", year: 2018 }, // Feb 10
  { id: 509, title: "Notting Hill", year: 1999 }, // Feb 11
  { id: 313369, title: "La La Land", year: 2016 }, // Feb 12
  { id: 4348, title: "Pride & Prejudice", year: 2005 }, // Feb 13
  { id: 639, title: "When Harry Met Sally...", year: 1989 }, // Feb 14
];

const REVEAL_KEY = "moviemend_valentine_daily_reveal";

export const ValentineDailyPick = () => {
  const navigate = useNavigate();
  const { isValentine, daysUntilValentine, isValentineDay } = useSeasonal();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBooviReaction, setShowBooviReaction] = useState(false);

  const today = new Date();
  const dayIndex = today.getDate() - 8; // Feb 8 = index 0
  const todayMovie = VALENTINE_MOVIES[Math.max(0, Math.min(dayIndex, VALENTINE_MOVIES.length - 1))];

  useEffect(() => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    const wasRevealed = localStorage.getItem(todayKey);
    if (wasRevealed) {
      setIsRevealed(true);
    }
  }, []);

  const handleReveal = () => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    localStorage.setItem(todayKey, "true");
    setShowConfetti(true);
    
    setTimeout(() => {
      setIsRevealed(true);
      setShowBooviReaction(true);
    }, 300);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    setTimeout(() => {
      setShowBooviReaction(false);
    }, 5000);
  };

  const getCountdownText = () => {
    if (isValentineDay) return "💕 Happy Valentine's Day!";
    if (daysUntilValentine === 1) return "✨ Tomorrow is Valentine's!";
    return `${daysUntilValentine} days until Valentine's`;
  };

  if (!isValentine) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="relative"
    >
      {/* Heart confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-30 -top-20 -left-4 -right-4">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-rose-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: 12 + Math.random() * 12 + 'px',
                }}
                initial={{ y: -30, opacity: 1, rotate: 0, scale: 1 }}
                animate={{ 
                  y: 500, 
                  opacity: [1, 1, 0], 
                  rotate: 360 + Math.random() * 720,
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              >
                {i % 3 === 0 ? '💕' : i % 3 === 1 ? '❤️' : '💗'}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div 
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(350 45% 96%) 0%, hsl(340 40% 94%) 100%)",
          boxShadow: "0 8px 32px -8px hsl(350 60% 50% / 0.2)",
        }}
      >
        {/* Pink shimmer accent line at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(350 80% 65%), transparent)",
          }}
        />

        <div className="relative z-10 p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(350 70% 55%) 0%, hsl(350 70% 45%) 100%)",
                  boxShadow: "0 4px 12px hsl(350 70% 50% / 0.35)",
                }}
                animate={{ 
                  boxShadow: [
                    "0 4px 12px hsl(350 70% 50% / 0.35)",
                    "0 4px 20px hsl(350 70% 50% / 0.5)",
                    "0 4px 12px hsl(350 70% 50% / 0.35)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-white fill-white" />
              </motion.div>
              <div>
                <span className="text-sm font-bold text-rose-900">
                  Today's Romance Pick
                </span>
                <p className="text-xs text-rose-700/70">
                  February {today.getDate()}
                </p>
              </div>
            </div>
            
            {/* Countdown badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, hsl(350 70% 55%) 0%, hsl(340 70% 48%) 100%)",
                boxShadow: "0 2px 8px hsl(350 70% 50% / 0.3)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getCountdownText()}</span>
            </div>
          </div>

          {/* Movie reveal area */}
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="unrevealed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                {/* Teaser card */}
                <div 
                  className="rounded-2xl p-6 text-center cursor-pointer group"
                  style={{
                    background: "linear-gradient(135deg, hsl(350 60% 50%) 0%, hsl(340 60% 42%) 100%)",
                  }}
                  onClick={handleReveal}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-12 h-12 mx-auto mb-3 text-white fill-white/30" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Your Daily Love Story
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    Tap to reveal today's romantic pick 💕
                  </p>
                  <Button
                    className="bg-white text-rose-600 hover:bg-white/90 font-semibold rounded-xl"
                    onClick={handleReveal}
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Reveal Movie
                  </Button>
                </div>
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
                    background: "linear-gradient(145deg, hsl(350 50% 35%) 0%, hsl(350 50% 28%) 100%)",
                    boxShadow: "0 8px 25px -8px hsl(350 50% 20% / 0.5)",
                  }}
                  onClick={() => navigate(`/movie/${todayMovie.id}`)}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Film className="w-8 h-8 text-rose-200 mb-2" />
                  <span className="text-3xl">💕</span>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                      💕 Romance Classic
                    </span>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-rose-900 mb-1 leading-tight"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {todayMovie.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm text-rose-700/70 mb-4"
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
                      className="rounded-xl font-medium text-white"
                      style={{
                        background: "linear-gradient(135deg, hsl(350 70% 55%) 0%, hsl(340 70% 48%) 100%)",
                        boxShadow: "0 4px 12px hsl(350 70% 50% / 0.35)",
                      }}
                    >
                      View Movie Details
                    </Button>
                  </motion.div>
                </div>

                {/* Boovi reaction */}
                <AnimatePresence>
                  {showBooviReaction && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, x: 30, rotate: 15 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1, 
                        x: 0, 
                        rotate: [15, -10, 5, 0],
                      }}
                      exit={{ opacity: 0, scale: 0, x: 20 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                      className="absolute -right-3 -top-8"
                    >
                      <img src={booviAvatar} alt="Boovi" className="w-16 h-16 object-contain" />
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
