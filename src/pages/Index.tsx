import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiscoverMovies } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/hooks/usePreferences";
import { NotificationBell } from "@/components/NotificationBell";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { ChristmasMoviesSection } from "@/components/christmas/ChristmasMoviesSection";
import { ChristmasBoovi } from "@/components/christmas/ChristmasBoovi";
import { ChristmasHeroBanner } from "@/components/christmas/ChristmasHeroBanner";
import { ChristmasDailyPick } from "@/components/christmas/ChristmasDailyPick";
import { ChristmasOnboarding, useChristmasOnboarding } from "@/components/christmas/ChristmasOnboarding";

const Index = () => {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { watchlist } = useWatchlist();
  const { isChristmas } = useSeasonal();
  const { showOnboarding, completeOnboarding } = useChristmasOnboarding();
  
  const { data: moviesData, isLoading } = useDiscoverMovies({
    watchProviders: preferences.platforms.length > 0 
      ? preferences.platforms.map(p => parseInt(p))
      : undefined,
    genres: preferences.genres.length > 0
      ? preferences.genres.map(g => parseInt(g))
      : undefined,
    region: preferences.region,
    sortBy: 'popularity.desc',
  });

  const hasRatedMovies = watchlist.some(item => item.status === 'watched' && item.rating !== null);

  return (
    <>
      {/* Christmas First-Launch Onboarding */}
      {isChristmas && showOnboarding && (
        <ChristmasOnboarding onComplete={completeOnboarding} />
      )}
      
      <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border lg:top-16">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isChristmas ? (
                  <ChristmasBoovi size="sm" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
                <h1 className="text-xl font-bold">
                  {isChristmas ? "MovieMend 🎄" : "MovieMend"}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => navigate("/preferences")}
                  title="Setup Preferences"
                >
                  <Wrench className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => navigate("/settings")}
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          {/* Christmas Hero Banner */}
          {isChristmas && (
            <ChristmasHeroBanner />
          )}

          {/* Christmas Daily Pick */}
          {isChristmas && (
            <ChristmasDailyPick />
          )}

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
              ))}
            </div>
          ) : moviesData?.results && moviesData.results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {moviesData.results.slice(0, 18).map((movie) => (
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

          {/* Christmas Movies Section */}
          {isChristmas && (
            <ChristmasMoviesSection limit={6} />
          )}
        </main>

        <BottomNav />
      </div>
    </>
  );
};

export default Index;
