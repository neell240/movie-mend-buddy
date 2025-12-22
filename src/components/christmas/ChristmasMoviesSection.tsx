import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

// Christmas movie IDs from TMDB (classic Christmas films)
const CHRISTMAS_MOVIE_IDS = [
  771, // Home Alone
  772, // Home Alone 2
  13183, // The Polar Express
  10719, // Elf
  11970, // The Holiday
  17895, // Christmas with the Kranks
  627, // It's a Wonderful Life
  12133, // A Christmas Story
  10437, // The Nightmare Before Christmas
  10545, // How the Grinch Stole Christmas
  508965, // Klaus
  14564, // The Santa Clause
  11395, // The Santa Clause 2
  9800, // Jingle All the Way
  12684, // Love Actually
  2593, // The Muppet Christmas Carol
  34544, // Arthur Christmas
  14560, // Die Hard (it's a Christmas movie!)
  4148, // A Christmas Carol (2009)
  13673, // National Lampoon's Christmas Vacation
];

interface ChristmasMoviesSectionProps {
  limit?: number;
}

export const ChristmasMoviesSection = ({ limit = 12 }: ChristmasMoviesSectionProps) => {
  const navigate = useNavigate();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['christmas-movies'],
    queryFn: async () => {
      // Fetch movie details for each Christmas movie
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
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-[hsl(var(--christmas-forest))]" />
          <h2 className="text-lg font-bold text-foreground">
            Christmas Movies 🎄
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-[hsl(var(--christmas-cranberry))] hover:text-[hsl(var(--christmas-cranberry))]/80 hover:bg-[hsl(var(--christmas-cranberry))]/10 rounded-xl"
          onClick={() => navigate("/search?q=christmas")}
        >
          See All
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Cozy up with a perfect holiday film ☕🍿
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
          ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          No Christmas movies found
        </p>
      )}
    </section>
  );
};
