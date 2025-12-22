import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Christmas movies for each day of December (22-25)
const CHRISTMAS_MOVIES = [
  { id: 508965, title: "Klaus", year: 2019 },
  { id: 10719, title: "Elf", year: 2003 },
  { id: 771, title: "Home Alone", year: 1990 },
  { id: 13183, title: "The Polar Express", year: 2004 },
  { id: 823758, title: "Spirited", year: 2022 },
  { id: 772071, title: "A Boy Called Christmas", year: 2021 },
  { id: 14574, title: "The Muppet Christmas Carol", year: 1992 },
  { id: 11970, title: "Miracle on 34th Street", year: 1947 },
  { id: 12536, title: "The Santa Clause", year: 1994 },
  { id: 854, title: "The Nightmare Before Christmas", year: 1993 },
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
    }, 500);
    
    setTimeout(() => {
      setShowConfetti(false);
      setShowBooviReaction(false);
    }, 3000);
  };

  const getDateText = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = today.getDate();
    const month = months[today.getMonth()];
    
    if (isChristmasDay) return `${month} ${day} • Merry Christmas! 🎄`;
    if (daysUntilChristmas === 1) return `${month} ${day} • Christmas Eve!`;
    return `${month} ${day} • ${daysUntilChristmas} days to Christmas`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#f6efe4', '#8b181d', '#e6be9a', '#325632'][i % 4],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: 400, 
                  opacity: 0, 
                  rotate: 720,
                  x: (Math.random() - 0.5) * 200,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  ease: "easeOut",
                  delay: Math.random() * 0.3,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main card - cream colored */}
      <div 
        className="relative rounded-3xl overflow-hidden cozy-card"
        style={{
          background: "linear-gradient(145deg, hsl(36 48% 95%) 0%, hsl(36 45% 91%) 100%)",
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231d351d' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--christmas-red))] flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-[hsl(120,32%,16%)]">
                Today's Christmas Movie
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[hsl(120,28%,35%)]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{getDateText()}</span>
            </div>
          </div>

          {/* Movie reveal area */}
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--christmas-red))] to-[hsl(var(--christmas-wine))] flex items-center justify-center shadow-lg"
                  animate={{ 
                    boxShadow: [
                      "0 10px 30px -10px hsla(357, 72%, 32%, 0.3)",
                      "0 10px 40px -10px hsla(357, 72%, 32%, 0.5)",
                      "0 10px 30px -10px hsla(357, 72%, 32%, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>
                
                <p className="text-[hsl(120,28%,30%)] mb-4 text-sm">
                  Tap to reveal today's special pick!
                </p>
                
                <Button
                  onClick={handleReveal}
                  className="bg-[hsl(var(--christmas-red))] hover:bg-[hsl(var(--christmas-wine))] text-white rounded-xl px-6 py-5 font-semibold cta-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reveal Today's Pick ✨
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4"
              >
                {/* Movie poster placeholder */}
                <div 
                  className="w-24 h-36 rounded-xl bg-gradient-to-br from-[hsl(120,32%,20%)] to-[hsl(120,35%,15%)] flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/movie/${todayMovie.id}`)}
                >
                  <span className="text-4xl">🎬</span>
                </div>
                
                <div className="flex-1">
                  <motion.h3 
                    className="text-xl font-bold text-[hsl(120,32%,15%)] mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {todayMovie.title}
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-[hsl(120,28%,40%)] mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {todayMovie.year} • Christmas Classic
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => navigate(`/movie/${todayMovie.id}`)}
                      variant="outline"
                      className="rounded-xl border-[hsl(120,28%,26%)] text-[hsl(120,32%,20%)] hover:bg-[hsl(120,28%,90%)]"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </motion.div>
                </div>

                {/* Boovi reaction */}
                <AnimatePresence>
                  {showBooviReaction && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -right-2 -top-4"
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
