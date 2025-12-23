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

// Extended list of Christmas movie IDs from TMDB
const CHRISTMAS_MOVIE_IDS = [
  // 🎄 All-Time Christmas Classics
  771,    // Home Alone (1990)
  772,    // Home Alone 2: Lost in New York (1992)
  10719,  // Elf (2003)
  13183,  // The Polar Express (2004)
  11970,  // A Christmas Carol (2009)
  12684,  // Scrooged (1988)
  13673,  // It's a Wonderful Life (1946)
  627,    // Miracle on 34th Street (1947)
  11881,  // Miracle on 34th Street (1994)
  12133,  // The Santa Clause (1994)
  10437,  // The Santa Clause 2
  10545,  // The Santa Clause 3
  14560,  // How the Grinch Stole Christmas (2000)
  14564,  // The Grinch (2018)
  14462,  // A Christmas Story
  17895,  // The Nightmare Before Christmas
  
  // 🎁 Modern Christmas Favorites
  411729, // The Christmas Chronicles (2018)
  594328, // The Christmas Chronicles: Part Two (2020)
  508965, // Klaus (2019)
  532199, // Noelle (2019)
  42260,  // Last Christmas (2019)
  640295, // Jingle Jangle: A Christmas Journey (2020)
  830784, // Spirited (2022)
  520946, // A Boy Called Christmas
  653562, // Violent Night
  
  // 🎬 Animated Christmas Hits
  34544,  // Arthur Christmas
  81188,  // Rise of the Guardians
  13493,  // A Charlie Brown Christmas
  
  // ☕ Cozy & Romantic Christmas
  9800,   // Love Actually
  11395,  // The Holiday
  12759,  // Four Christmases
  11159,  // While You Were Sleeping
  508442, // Let It Snow
  554993, // Happiest Season
  532067, // The Knight Before Christmas
  645886, // Holidate
  14585,  // The Family Stone
  
  // 😂 Christmas Comedy
  850,    // National Lampoon's Christmas Vacation
  10717,  // Bad Santa
  4148,   // Jingle All the Way
  8388,   // Fred Claus
  283995, // Office Christmas Party
  364689, // A Bad Moms Christmas
  282756, // The Night Before
  11000,  // Eight Crazy Nights
  
  // 🎬 "Is It a Christmas Movie?" Picks
  562,    // Die Hard
  671,    // Harry Potter and the Philosopher's Stone
  2593,   // Gremlins
  9350,   // Trading Places
  258230, // Krampus
  
  // More Holiday Favorites
  10137,  // The Muppet Christmas Carol
  429300, // Daddy's Home 2
  447200, // Daddy's Home
  414419, // Pottersville
];

export default function ChristmasMovies() {
  const navigate = useNavigate();
  const [randomMovie, setRandomMovie] = useState<any>(null);
  const [showRandomPicker, setShowRandomPicker] = useState(false);

  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['christmas-movies-full'],
    queryFn: async () => {
      // Batch requests in smaller chunks to avoid overwhelming the API
      const chunkSize = 10;
      const results: any[] = [];
      
      for (let i = 0; i < CHRISTMAS_MOVIE_IDS.length; i += chunkSize) {
        const chunk = CHRISTMAS_MOVIE_IDS.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async (id) => {
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
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults.filter(Boolean));
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
