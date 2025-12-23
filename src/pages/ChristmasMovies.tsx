import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine, ArrowLeft, Snowflake, Gift, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

// Curated list of top Christmas movies (further reduced + safer for API limits)
const CHRISTMAS_MOVIE_IDS = [
  // 🎄 Essential Classics
  771,    // Home Alone
  772,    // Home Alone 2
  10719,  // Elf
  13183,  // The Polar Express
  17895,  // The Nightmare Before Christmas
  13673,  // It's a Wonderful Life

  // 🎁 Modern Favorites
  508965, // Klaus
  830784, // Spirited

  // 😂 Comedy / Alt picks
  850,    // National Lampoon's Christmas Vacation
  10137,  // The Muppet Christmas Carol
  12133,  // The Santa Clause
  562,    // Die Hard
];

export default function ChristmasMovies() {
  const navigate = useNavigate();
  const [randomMovie, setRandomMovie] = useState<any>(null);
  const [showRandomPicker, setShowRandomPicker] = useState(false);

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['christmas-movies-full'],
    queryFn: async () => {
      // Batch requests in smaller chunks to avoid overwhelming the API
      // (Lower concurrency + small delay between chunks)
      const chunkSize = 4;
      const delayMsBetweenChunks = 250;
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      const results: any[] = [];

      for (let i = 0; i < CHRISTMAS_MOVIE_IDS.length; i += chunkSize) {
        const chunk = CHRISTMAS_MOVIE_IDS.slice(i, i + chunkSize);

        const chunkPromises = chunk.map(async (id) => {
          try {
            const { data, error } = await supabase.functions.invoke('tmdb-details', {
              body: { movieId: id },
            });
            if (error) return null;
            return data;
          } catch {
            return null;
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults.filter(Boolean));

        // Brief pause to reduce rate-limit spikes
        if (i + chunkSize < CHRISTMAS_MOVIE_IDS.length) {
          await sleep(delayMsBetweenChunks);
        }
      }

      return results;
    },
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });

  const pickRandomMovie = () => {
    if (movies && movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[randomIndex]);
      setShowRandomPicker(true);
    }
  };

  const closeRandomPicker = () => {
    setShowRandomPicker(false);
    setRandomMovie(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-4">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 p-4 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, hsl(355 45% 14% / 0.95), hsl(355 45% 14% / 0.8))",
          borderBottom: "1px solid hsl(355 40% 25%)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-[hsl(45,50%,85%)] hover:bg-[hsl(355,40%,25%)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <TreePine className="w-6 h-6 text-[hsl(145,40%,45%)]" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(42,85%,70%)]">
                Christmas Movies 🎄
              </h1>
              <p className="text-xs text-[hsl(45,50%,75%)]">
                {movies?.length || 0} holiday favorites
              </p>
            </div>
          </div>

          <motion.div
            className="ml-auto"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Snowflake className="w-5 h-5 text-[hsl(200,60%,70%)]" />
          </motion.div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="p-4 max-w-7xl mx-auto">
        {/* Random Movie Picker Modal */}
        <AnimatePresence>
          {showRandomPicker && randomMovie && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeRandomPicker}
            >
              <motion.div
                className="p-6 rounded-2xl max-w-sm w-full text-center"
                style={{
                  background: "linear-gradient(135deg, hsl(355 45% 18%), hsl(145 30% 20%))",
                  border: "2px solid hsl(42 70% 50%)",
                  boxShadow: "0 0 40px hsl(42 70% 40% / 0.5)",
                }}
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.5 }}
                >
                  <Gift className="w-12 h-12 mx-auto mb-4 text-[hsl(42,85%,60%)]" />
                </motion.div>
                <h3 className="text-lg font-bold text-[hsl(42,85%,75%)] mb-2">
                  🎄 Your Random Pick!
                </h3>
                <p className="text-[hsl(45,50%,85%)] font-medium mb-4">
                  {randomMovie.title}
                </p>
                {randomMovie.poster_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w300${randomMovie.poster_path}`}
                    alt={randomMovie.title}
                    className="w-32 mx-auto rounded-lg mb-4 shadow-lg"
                  />
                )}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={pickRandomMovie}
                    className="gap-2 border-[hsl(42,50%,40%)] text-[hsl(42,85%,75%)] hover:bg-[hsl(355,40%,25%)]"
                  >
                    <Shuffle className="w-4 h-4" />
                    Pick Again
                  </Button>
                  <Button
                    onClick={() => {
                      closeRandomPicker();
                      navigate(`/movie/${randomMovie.id}`);
                    }}
                    className="bg-[hsl(355,50%,40%)] hover:bg-[hsl(355,50%,50%)] text-white"
                  >
                    View Movie
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Banner */}
        <motion.div 
          className="mb-6 p-6 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, hsl(355 45% 18%), hsl(145 30% 20%), hsl(355 45% 18%))",
            border: "1px solid hsl(42 50% 35% / 0.3)",
            boxShadow: "0 8px 32px hsl(355 50% 10% / 0.4)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-3"
          >
            <Gift className="w-10 h-10 text-[hsl(42,85%,60%)]" />
          </motion.div>
          <h2 className="text-lg font-bold text-[hsl(42,85%,75%)] mb-2">
            🎅 Holiday Movie Marathon
          </h2>
          <p className="text-sm text-[hsl(45,50%,75%)] mb-4">
            From heartwarming classics to hilarious comedies, find your perfect Christmas movie
          </p>
          
          {/* Random Movie Button */}
          <Button
            onClick={pickRandomMovie}
            disabled={isLoading || !movies?.length}
            className="gap-2 bg-[hsl(42,70%,45%)] hover:bg-[hsl(42,70%,55%)] text-[hsl(355,45%,12%)] font-semibold"
          >
            <Shuffle className="w-4 h-4" />
            🎲 Pick Random Movie
          </Button>
        </motion.div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <Skeleton 
                key={i} 
                className="aspect-[2/3] rounded-xl"
                style={{ background: "hsl(355 40% 20%)" }}
              />
            ))}
          </div>
        ) : movies && movies.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.03 } }
            }}
          >
            {movies.map((movie: any, index: number) => (
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <TreePine className="w-12 h-12 mx-auto mb-4 text-[hsl(145,30%,40%)]" />
            <p className="text-[hsl(45,50%,70%)]">No Christmas movies found</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
