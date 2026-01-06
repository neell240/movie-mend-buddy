import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { EnhancedMovieCard } from "@/components/EnhancedMovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscoverMovies } from "@/hooks/useTMDB";

export const BestOf2025Section = () => {
  const navigate = useNavigate();
  
  // Fetch top rated movies from 2025
  const { data: moviesData, isLoading } = useDiscoverMovies({
    sortBy: 'vote_average.desc',
    year: 2025,
    minVoteCount: 100, // Only movies with enough votes for reliable rating
  });

  const movies = moviesData?.results?.slice(0, 12) || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 via-background to-primary/10 border border-accent/20 p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Best of 2025
            <Star className="w-4 h-4 text-accent fill-accent" />
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Top rated movies from last year
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Rank badge for top 3 */}
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                  #{index + 1}
                </div>
              )}
              <EnhancedMovieCard
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No 2025 movies found yet.</p>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Trophy className="w-24 h-24 text-accent" />
      </div>
    </motion.section>
  );
};
