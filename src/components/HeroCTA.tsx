import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Shuffle, Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeasonal } from "@/hooks/useChristmasMode";

interface HeroCTAProps {
  onScrollToDaily?: () => void;
  onRefreshPick?: () => void;
}

export const HeroCTA = ({ onScrollToDaily, onRefreshPick }: HeroCTAProps) => {
  const navigate = useNavigate();
  const { isChristmas } = useSeasonal();
  const [moodInput, setMoodInput] = useState("");

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moodInput.trim()) {
      // Navigate to AI chat with pre-filled query
      navigate(`/ai-chat?query=${encodeURIComponent(moodInput)}`);
    }
  };

  const handleGetRecommendation = () => {
    if (onScrollToDaily) {
      onScrollToDaily();
    }
    if (onRefreshPick) {
      onRefreshPick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-4"
    >
      {/* CTA Buttons Row */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleGetRecommendation}
          className={`flex-1 min-w-[140px] gap-2 rounded-xl font-semibold ${
            isChristmas 
              ? "bg-gradient-to-r from-[hsl(355,72%,45%)] to-[hsl(355,72%,40%)] hover:from-[hsl(355,72%,50%)] hover:to-[hsl(355,72%,45%)] text-white shadow-lg shadow-[hsl(355,72%,45%)/0.3]"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          size="lg"
        >
          <Shuffle className="w-4 h-4" />
          Get a Recommendation
        </Button>
        
        <Button
          onClick={() => navigate("/ai-chat")}
          variant="outline"
          className={`flex-1 min-w-[140px] gap-2 rounded-xl font-semibold ${
            isChristmas 
              ? "border-[hsl(42,85%,65%)] text-[hsl(42,85%,65%)] hover:bg-[hsl(42,85%,65%)/0.1] hover:text-[hsl(42,85%,70%)]"
              : "border-primary text-primary hover:bg-primary/10"
          }`}
          size="lg"
        >
          <MessageCircle className="w-4 h-4" />
          Chat with Boovi
        </Button>
      </div>

      {/* Mood Input Field */}
      <form onSubmit={handleMoodSubmit} className="relative">
        <div className="relative group">
          <div 
            className={`absolute inset-0 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity ${
              isChristmas 
                ? "bg-[hsl(42,85%,65%)/0.2]" 
                : "bg-primary/20"
            }`}
          />
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Sparkles 
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isChristmas ? "text-[hsl(42,85%,65%)]" : "text-primary"
                }`}
              />
              <Input
                type="text"
                placeholder="Tell Boovi your mood... e.g., 'cozy family comedy'"
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                className={`pl-10 pr-4 py-5 rounded-xl text-sm ${
                  isChristmas 
                    ? "bg-[hsl(355,45%,12%)/0.6] border-[hsl(42,85%,65%)/0.3] text-[hsl(45,60%,96%)] placeholder:text-[hsl(42,45%,60%)] focus:border-[hsl(42,85%,65%)] focus:ring-[hsl(42,85%,65%)/0.3]"
                    : "bg-background border-border text-foreground placeholder:text-muted-foreground"
                }`}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!moodInput.trim()}
              className={`h-[42px] w-[42px] rounded-xl shrink-0 ${
                isChristmas 
                  ? "bg-[hsl(42,85%,65%)] hover:bg-[hsl(42,85%,70%)] text-[hsl(355,45%,15%)] disabled:bg-[hsl(42,85%,65%)/0.3] disabled:text-[hsl(355,45%,15%)/0.5]"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Quick mood chips */}
      <div className="flex flex-wrap gap-2">
        {["Cozy & heartwarming", "Action-packed", "Laugh out loud", "Mind-bending thriller"].map((mood) => (
          <button
            key={mood}
            onClick={() => navigate(`/ai-chat?query=${encodeURIComponent(`I want something ${mood.toLowerCase()}`)}`)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${
              isChristmas 
                ? "bg-[hsl(355,45%,20%)/0.6] text-[hsl(42,45%,85%)] hover:bg-[hsl(42,85%,65%)/0.2] hover:text-[hsl(42,85%,70%)] border border-[hsl(42,85%,65%)/0.2]"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
