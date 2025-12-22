import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MovieCard } from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="cozy-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-[hsl(120,28%,30%)]" />
          <h2 className="text-lg font-bold text-[hsl(120,32%,16%)]">
            Christmas Movies 🎄
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-[hsl(120,28%,26%)] text-[hsl(120,32%,25%)] hover:bg-[hsl(120,28%,90%)] rounded-xl"
          onClick={() => navigate("/search?q=christmas")}
        >
          See All
        </Button>
      </div>

      <p className="text-sm text-[hsl(120,28%,40%)]">
        Cozy up with a perfect holiday film ☕🍿
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl bg-[hsl(120,20%,85%)]" />
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
        <p className="text-center text-[hsl(120,28%,40%)] py-8">
          No Christmas movies found
        </p>
      )}
    </section>
  );
};
