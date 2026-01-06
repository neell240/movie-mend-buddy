import { motion } from "framer-motion";
import { Sparkles, PartyPopper } from "lucide-react";

export const NewYearBanner = () => {
  const text = "Happy New Year 2026!";
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
              className={`text-2xl md:text-3xl font-bold text-accent drop-shadow-[0_0_10px_hsl(43,90%,55%)] ${
                letter === " " ? "w-2" : ""
              }`}
              style={{
                textShadow: "0 0 20px hsl(43, 90%, 55%)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Celebration message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.5 }}
          className="flex items-center gap-2 text-accent"
        >
          <PartyPopper className="w-5 h-5 animate-bounce" />
          <span className="text-sm font-medium text-muted-foreground">New year, new movies to discover!</span>
          <PartyPopper className="w-5 h-5 animate-bounce" style={{ animationDelay: "0.1s" }} />
        </motion.div>

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
