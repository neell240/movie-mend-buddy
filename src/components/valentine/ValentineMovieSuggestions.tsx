import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useSeasonal } from "@/hooks/useChristmasMode";
import booviAvatar from "@/assets/boovi-avatar.png";
import novaAvatar from "@/assets/nova-avatar.png";

interface MovieSuggestion {
  id: number;
  title: string;
  year: number;
  rating: number;
  reason: string;
  category: "romantic" | "family" | "fun";
}

const VALENTINE_SUGGESTIONS: MovieSuggestion[] = [
  { id: 11036, title: "The Notebook", year: 2004, rating: 7.9, reason: "A love story that never gets old", category: "romantic" },
  { id: 862, title: "Toy Story", year: 1995, rating: 8.3, reason: "Heartwarming for the whole family", category: "family" },
  { id: 508442, title: "Soul", year: 2020, rating: 8.1, reason: "Feel-good and surprisingly deep", category: "fun" },
];

const categoryLabels = {
  romantic: { label: "Romantic", color: "hsl(350 70% 55%)" },
  family: { label: "Family-Friendly", color: "hsl(340 60% 50%)" },
  fun: { label: "Light & Fun", color: "hsl(330 55% 50%)" },
};

export const ValentineMovieSuggestions = () => {
  const navigate = useNavigate();
  const { isValentine } = useSeasonal();

  if (!isValentine) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Header with Boovi & Nova */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-3">
          <img src={booviAvatar} alt="Boovi" className="w-9 h-9 object-contain rounded-full relative z-10" />
          <img src={novaAvatar} alt="Nova" className="w-8 h-8 object-contain rounded-full" />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: "hsl(40 50% 94%)" }}>
            Valentine's Picks
          </h3>
          <p className="text-xs" style={{ color: "hsl(350 30% 65%)" }}>
            Curated by Boovi & Nova
          </p>
        </div>
      </div>

      {/* Movie cards */}
      <div className="space-y-3">
        {VALENTINE_SUGGESTIONS.map((movie, i) => {
          const cat = categoryLabels[movie.category];
          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group"
              style={{
                background: "hsl(350 35% 96%)",
                boxShadow: "0 4px 16px -4px hsl(350 40% 10% / 0.15)",
              }}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Heart icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${cat.color}20` }}
              >
                <Heart className="w-5 h-5" style={{ color: cat.color }} fill={cat.color} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: `${cat.color}15`, color: cat.color }}
                  >
                    {cat.label}
                  </span>
                </div>
                <h4 className="font-bold text-sm truncate" style={{ color: "hsl(350 40% 20%)" }}>
                  {movie.title}
                  <span className="font-normal text-xs ml-1.5" style={{ color: "hsl(350 25% 50%)" }}>
                    ({movie.year})
                  </span>
                </h4>
                <p className="text-xs mt-0.5" style={{ color: "hsl(350 20% 45%)" }}>
                  {movie.reason}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold" style={{ color: "hsl(350 30% 30%)" }}>
                  {movie.rating}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm mt-4 font-medium"
        style={{ color: "hsl(350 40% 70%)" }}
      >
        Want something different? Just ask 💬
      </motion.p>
    </motion.section>
  );
};
