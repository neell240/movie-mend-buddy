import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine, ArrowLeft, Snowflake, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";

// Extended list of Christmas movie IDs from TMDB
const CHRISTMAS_MOVIE_IDS = [
  // Classic Christmas
  771,    // Home Alone
  772,    // Home Alone 2
  13183,  // The Polar Express
  10719,  // Elf
  11970,  // A Christmas Carol (2009)
  17895,  // The Nightmare Before Christmas
  627,    // Miracle on 34th Street
  12133,  // The Santa Clause
  10437,  // The Santa Clause 2
  10545,  // The Santa Clause 3
  508965, // Klaus
  14564,  // The Grinch (2018)
  14560,  // How the Grinch Stole Christmas (2000)
  11395,  // The Holiday
  9800,   // Love Actually
  12684,  // Scrooged
  2593,   // Gremlins
  34544,  // Arthur Christmas
  4148,   // Jingle All the Way
  13673,  // It's a Wonderful Life
  
  // More Christmas favorites
  850,    // National Lampoon's Christmas Vacation
  10137,  // The Muppet Christmas Carol
  14585,  // The Family Stone
  10717,  // Bad Santa
  14462,  // A Christmas Story
  8388,   // Fred Claus
  653562, // Violent Night
  411729, // The Christmas Chronicles
  594328, // The Christmas Chronicles 2
  11000,  // Eight Crazy Nights
  42260,  // Last Christmas
  520946, // A Boy Called Christmas
  9350,   // Trading Places
  258230, // Krampus
  283995, // Office Christmas Party
  429300, // Daddy's Home 2
  414419, // Pottersville
  532199, // Noelle
  282756, // The Night Before
  364689, // A Bad Moms Christmas
  447200, // Daddy's Home
  532067, // The Knight Before Christmas
  508442, // Let It Snow
  554993, // Happiest Season
  640295, // Jingle Jangle
];

export default function ChristmasMovies() {
  const navigate = useNavigate();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['christmas-movies-full'],
    queryFn: async () => {
      const moviePromises = CHRISTMAS_MOVIE_IDS.map(async (id) => {
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
          <p className="text-sm text-[hsl(45,50%,75%)]">
            From heartwarming classics to hilarious comedies, find your perfect Christmas movie
          </p>
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
