import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, PartyPopper } from "lucide-react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const getTimeUntilMidnight = (): TimeLeft => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background/30 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3rem] border border-accent/30"
    >
      <span className="text-2xl font-bold text-accent tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
    </motion.div>
    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export const NewYearBanner = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeUntilMidnight);
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getTimeUntilMidnight();
      setTimeLeft(newTime);
      
      // Check if it's midnight
      if (newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        setIsNewYear(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const text = isNewYear ? "Happy New Year!" : "Happy New Year 2026";
  const letters = text.split("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-accent/30 p-6 mb-6"
    >
      {/* Decorative elements */}
      <div className="absolute top-2 left-4 text-accent/60">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute top-2 right-4 text-accent/60">
        <PartyPopper className="w-5 h-5" />
      </div>
      
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated title */}
        <div className="flex flex-wrap justify-center">
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: i * 0.05,
                duration: 0.4,
                ease: "easeOut" as const,
              }}
              className={`text-2xl md:text-3xl font-bold ${
                letter === " " ? "w-2" : ""
              } ${
                isNewYear
                  ? "text-accent drop-shadow-[0_0_10px_hsl(43,90%,55%)]"
                  : "text-foreground"
              }`}
              style={{
                textShadow: isNewYear ? "0 0 20px hsl(43, 90%, 55%)" : "none",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Countdown or celebration */}
        {isNewYear ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex items-center gap-2 text-accent"
          >
            <PartyPopper className="w-6 h-6 animate-bounce" />
            <span className="text-lg font-medium">Let's celebrate!</span>
            <PartyPopper className="w-6 h-6 animate-bounce" style={{ animationDelay: "0.1s" }} />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Countdown to midnight</p>
            <div className="flex items-center gap-3">
              <CountdownUnit value={timeLeft.hours} label="hrs" />
              <span className="text-2xl text-accent font-bold mt-[-1rem]">:</span>
              <CountdownUnit value={timeLeft.minutes} label="min" />
              <span className="text-2xl text-accent font-bold mt-[-1rem]">:</span>
              <CountdownUnit value={timeLeft.seconds} label="sec" />
            </div>
          </div>
        )}

        {/* Decorative stars */}
        <div className="absolute bottom-2 left-1/4">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-accent rounded-full"
          />
        </div>
        <div className="absolute bottom-4 right-1/3">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};
