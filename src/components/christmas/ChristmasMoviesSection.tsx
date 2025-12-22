import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Christmas movie IDs from TMDB
const CHRISTMAS_MOVIE_IDS = [
  771, 772, 13183, 10719, 11970, 17895, 627, 12133, 10437, 10545,
  508965, 14564, 11395, 9800, 12684, 2593, 34544, 14560, 4148, 13673,
];

interface ChristmasMoviesSectionProps {
  limit?: number;
}

export const ChristmasMoviesSection = ({ limit = 12 }: ChristmasMoviesSectionProps) => {
  const navigate = useNavigate();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['christmas-movies'],
    queryFn: async () => {
      const moviePromises = CHRISTMAS_MOVIE_IDS.slice(0, limit).map(async (id) => {
        try {
          const { data, error } = await supabase.functions.invoke('tmdb-details', {
            body: { movieId: id }
          });
          if (error) return null;
          return data;
        } catch {
          return null;
        }
      });
      const results = await Promise.all(moviePromises);
      return results.filter(Boolean);
    },
    staleTime: 1000 * 60 * 60,
  });

  return (
    <motion.section 
      className="cozy-card p-5 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <TreePine className="w-5 h-5 text-[hsl(145,30%,35%)]" />
          </motion.div>
          <h2 className="text-lg font-bold text-[hsl(20,15%,18%)]">
            Christmas Movies 🎄
          </h2>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/search?q=christmas")}
          className="text-xs rounded-xl cta-glow text-white"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          See All
        </Button>
      </div>

      <p className="text-sm text-[hsl(20,15%,45%)]">
        Cozy up with a perfect holiday film ☕🍿
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl bg-[hsl(42,40%,90%)]" />
          ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie: any, index: number) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <MovieCard
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[hsl(20,15%,50%)] py-8">
          No Christmas movies found
        </p>
      )}
    </motion.section>
  );
};
