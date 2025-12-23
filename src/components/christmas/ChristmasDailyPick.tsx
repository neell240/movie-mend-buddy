import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Sparkles, Film, PartyPopper } from "lucide-react";
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
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBooviReaction, setShowBooviReaction] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const today = new Date();
  const dayIndex = today.getDate() - 22;
  const todayMovie = CHRISTMAS_MOVIES[Math.max(0, Math.min(dayIndex, CHRISTMAS_MOVIES.length - 1))];

  useEffect(() => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    const wasRevealed = localStorage.getItem(todayKey);
    if (wasRevealed) {
      setIsRevealed(true);
    }
  }, []);

  // Initialize scratch canvas
  useEffect(() => {
    if (isRevealed || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Draw gift wrap pattern
    const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    gradient.addColorStop(0, 'hsl(355, 72%, 45%)');
    gradient.addColorStop(0.5, 'hsl(355, 72%, 40%)');
    gradient.addColorStop(1, 'hsl(355, 72%, 35%)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Add gift wrap pattern (ribbon lines)
    ctx.strokeStyle = 'hsl(42, 85%, 65%)';
    ctx.lineWidth = 4;
    
    // Horizontal ribbon
    ctx.beginPath();
    ctx.moveTo(0, canvas.offsetHeight / 2);
    ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight / 2);
    ctx.stroke();
    
    // Vertical ribbon
    ctx.beginPath();
    ctx.moveTo(canvas.offsetWidth / 2, 0);
    ctx.lineTo(canvas.offsetWidth / 2, canvas.offsetHeight);
    ctx.stroke();

    // Add bow in center
    ctx.fillStyle = 'hsl(42, 85%, 65%)';
    ctx.beginPath();
    ctx.arc(canvas.offsetWidth / 2, canvas.offsetHeight / 2, 15, 0, Math.PI * 2);
    ctx.fill();

    // Add sparkles/stars pattern
    ctx.fillStyle = 'hsla(42, 85%, 75%, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.offsetWidth;
      const y = Math.random() * canvas.offsetHeight;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [isRevealed]);

  const handleScratch = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x * 2, y * 2, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }
    const progress = (transparentPixels / (imageData.data.length / 4)) * 100;
    setScratchProgress(progress);

    // Auto-reveal at 40% scratched
    if (progress > 40 && !isRevealed) {
      completeReveal();
    }
  }, [isRevealed]);

  const completeReveal = () => {
    const todayKey = `${REVEAL_KEY}_${today.toDateString()}`;
    localStorage.setItem(todayKey, "true");
    setShowConfetti(true);
    setIsScratching(false);
    
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
    if (isChristmasDay) return "🎄 Merry Christmas!";
    if (daysUntilChristmas === 1) return "✨ Christmas Eve!";
    return `${daysUntilChristmas} days until Christmas`;
  };

  if (!isChristmas) return null;

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
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-30 -top-20 -left-4 -right-4">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  backgroundColor: [
                    'hsl(355 72% 45%)',
                    'hsl(42 85% 65%)',
                    'hsl(42 50% 96%)',
                    'hsl(145 30% 35%)',
                  ][i % 4],
                  width: 8 + Math.random() * 8 + 'px',
                  height: 8 + Math.random() * 8 + 'px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  left: `${Math.random() * 100}%`,
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
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div className="relative cozy-card overflow-hidden">
        {/* Gold shimmer accent line at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(42 85% 65%), transparent)",
          }}
        />

        <div className="relative z-10 p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-11 h-11 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(355 72% 48%) 0%, hsl(355 72% 38%) 100%)",
                  boxShadow: "0 4px 12px hsl(355 72% 45% / 0.35)",
                }}
                animate={{ 
                  boxShadow: [
                    "0 4px 12px hsl(355 72% 45% / 0.35)",
                    "0 4px 20px hsl(355 72% 45% / 0.5)",
                    "0 4px 12px hsl(355 72% 45% / 0.35)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-sm font-bold text-[hsl(20,15%,18%)]">
                  Today's Movie Pick
                </span>
                <p className="text-xs text-[hsl(20,15%,40%)]">
                  December {today.getDate()}
                </p>
              </div>
            </div>
            
            {/* Countdown badge - Santa red */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, hsl(355 72% 48%) 0%, hsl(355 72% 40%) 100%)",
                boxShadow: "0 2px 8px hsl(355 72% 45% / 0.3)",
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
                key="scratch-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                {/* Hidden movie content (revealed by scratching) */}
                <div className="bg-gradient-to-br from-[hsl(145,30%,20%)] to-[hsl(145,28%,15%)] rounded-2xl p-6 text-center">
                  <Film className="w-12 h-12 mx-auto mb-3 text-[hsl(42,85%,65%)]" />
                  <h3 className="text-xl font-bold text-[hsl(42,50%,96%)] mb-1">
                    {todayMovie.title}
                  </h3>
                  <p className="text-sm text-[hsl(42,50%,80%)]">
                    {todayMovie.year} • Christmas Classic
                  </p>
                </div>

                {/* Scratch overlay canvas */}
                <canvas
                  ref={canvasRef}
                  tabIndex={0}
                  role="button"
                  aria-label="Scratch to reveal today's movie pick. Press Enter or Space to reveal instantly."
                  className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer touch-none focus:outline-none focus:ring-2 focus:ring-[hsl(42,85%,65%)] focus:ring-offset-2 focus:ring-offset-[hsl(355,45%,15%)]"
                  onMouseDown={() => { isDrawing.current = true; setIsScratching(true); }}
                  onMouseUp={() => { isDrawing.current = false; }}
                  onMouseLeave={() => { isDrawing.current = false; }}
                  onMouseMove={(e) => isDrawing.current && handleScratch(e)}
                  onTouchStart={() => { isDrawing.current = true; setIsScratching(true); }}
                  onTouchEnd={() => { isDrawing.current = false; }}
                  onTouchMove={handleScratch}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      completeReveal();
                    }
                  }}
                />

                {/* Scratch instruction */}
                {!isScratching && (
                  <motion.div 
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <PartyPopper className="w-8 h-8 text-white mb-2" />
                    <p className="text-white font-semibold text-sm">
                      Scratch to reveal! ✨
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                      Or press Enter/Space
                    </p>
                  </motion.div>
                )}

                {/* Snow dust particles while scratching */}
                {isScratching && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ 
                          y: '100%', 
                          opacity: [0, 1, 0],
                          x: (Math.random() - 0.5) * 50,
                        }}
                        transition={{ 
                          duration: 1 + Math.random(), 
                          repeat: Infinity,
                          delay: Math.random() * 0.5,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Quick reveal button */}
                <motion.div 
                  className="absolute bottom-3 right-3"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 }}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={completeReveal}
                    className="text-xs bg-white/90 hover:bg-white text-[hsl(355,72%,40%)] rounded-lg shadow-lg"
                  >
                    Quick reveal
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="flex items-center gap-5"
              >
                {/* Movie poster */}
                <motion.div 
                  className="w-28 h-40 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, hsl(145 30% 22%) 0%, hsl(145 28% 16%) 100%)",
                    boxShadow: "0 8px 25px -8px hsl(140 30% 10% / 0.5)",
                  }}
                  onClick={() => navigate(`/movie/${todayMovie.id}`)}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Film className="w-8 h-8 text-[hsl(42,85%,70%)] mb-2" />
                  <span className="text-3xl">🎬</span>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span className="text-xs font-semibold text-[hsl(355,72%,45%)] uppercase tracking-wider">
                      🎄 Christmas Classic
                    </span>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-bold text-[hsl(20,15%,15%)] mb-1 leading-tight"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {todayMovie.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm text-[hsl(20,15%,45%)] mb-4"
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
                      <ChristmasBoovi size="md" showGlow animate />
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
