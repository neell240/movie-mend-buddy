import { useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiscoverMovies } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/hooks/usePreferences";
import { NotificationBell } from "@/components/NotificationBell";
import { useWatchlist } from "@/hooks/useWatchlist";

const Index = () => {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { watchlist } = useWatchlist();
  
  const { data: moviesData, isLoading } = useDiscoverMovies({
    watchProviders: preferences.platforms.length > 0 
      ? preferences.platforms.map(p => parseInt(p))
      : undefined,
    region: preferences.region,
    sortBy: 'popularity.desc',
  });

  // Check if user has watched and rated movies
  const hasRatedMovies = watchlist.some(item => item.status === 'watched' && item.rating !== null);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">MovieMend</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate("/preferences")}
                className="text-xs"
              >
                Setup
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Personalized Recommendations */}
        {hasRatedMovies && (
          <PersonalizedRecommendations />
        )}

        {/* Movies Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {preferences.platforms.length > 0 
                ? `Available on Your Platforms` 
                : 'Popular Movies'}
            </h3>
            {preferences.platforms.length === 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/preferences")}
                className="text-xs"
              >
                Select Platforms
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
              ))}
            </div>
          ) : moviesData?.results && moviesData.results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {moviesData.results.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No movies found for your selected platforms.</p>
              <Button onClick={() => navigate("/preferences")} variant="outline">
                Update Preferences
              </Button>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
