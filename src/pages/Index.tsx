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
import { Snowfall } from "@/components/christmas/Snowfall";

const Index = () => {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { watchlist } = useWatchlist();
  const { isChristmas, showSnowfall } = useSeasonal();
  const { showOnboarding, completeOnboarding } = useChristmasOnboarding();
  
  // Parse preferences safely - filter out NaN values
  const watchProviders = preferences.platforms.length > 0 
    ? preferences.platforms.map(p => parseInt(p)).filter(n => !isNaN(n) && n > 0)
    : undefined;
  const genres = preferences.genres.length > 0
    ? preferences.genres.map(g => parseInt(g)).filter(n => !isNaN(n) && n > 0)
    : undefined;
    
  const { data: moviesData, isLoading } = useDiscoverMovies({
    watchProviders: watchProviders && watchProviders.length > 0 ? watchProviders : undefined,
    genres: genres && genres.length > 0 ? genres : undefined,
    region: preferences.region,
    sortBy: 'popularity.desc',
  });

  const hasRatedMovies = watchlist.some(item => item.status === 'watched' && item.rating !== null);

  return (
    <>
      {/* Global Snowfall for Christmas */}
      {isChristmas && <Snowfall enabled={showSnowfall} />}

      {/* Christmas First-Launch Onboarding */}
      {isChristmas && showOnboarding && (
        <ChristmasOnboarding onComplete={completeOnboarding} />
      )}
      
      <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16 christmas-grain">
        {/* Header */}
        <header 
          className="sticky top-0 z-40 backdrop-blur-lg border-b lg:top-16"
          style={isChristmas ? {
            background: "linear-gradient(to right, hsl(355 50% 18% / 0.95), hsl(355 45% 15% / 0.95))",
            borderColor: "hsl(355 40% 28%)",
          } : {
            background: "hsl(var(--background) / 0.8)",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isChristmas ? (
                  <ChristmasBoovi size="sm" showGlow={false} />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
                <h1 
                  className="text-xl font-bold"
                  style={isChristmas ? { 
                    color: "hsl(45 60% 96%)",
                    textShadow: "0 2px 8px hsl(355 50% 10% / 0.4)"
                  } : undefined}
                >
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
                  className={isChristmas ? "text-[hsl(45,60%,92%)] hover:text-[hsl(42,85%,70%)] hover:bg-[hsl(355,45%,25%)]" : ""}
                >
                  <Wrench className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => navigate("/settings")}
                  title="Settings"
                  className={isChristmas ? "text-[hsl(45,60%,92%)] hover:text-[hsl(42,85%,70%)] hover:bg-[hsl(355,45%,25%)]" : ""}
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

          {/* Christmas Movies Section - BEFORE Popular */}
          {isChristmas && (
            <ChristmasMoviesSection limit={6} />
          )}

          {/* Personalized Recommendations */}
          {hasRatedMovies && (
            <PersonalizedRecommendations />
          )}

          {/* Movies Section */}
          <section 
            className={isChristmas ? "cozy-card p-5" : ""}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className={isChristmas 
                  ? "text-base font-bold text-[hsl(120,32%,16%)]" 
                  : "text-sm font-semibold text-muted-foreground"
                }
              >
                {preferences.platforms.length > 0 
                  ? `Available on Your Platforms` 
                  : 'Popular Movies'}
              </h3>
              {preferences.platforms.length === 0 && (
                <Button
                  size="sm"
                  variant={isChristmas ? "outline" : "ghost"}
                  onClick={() => navigate("/preferences")}
                  className={isChristmas 
                    ? "text-xs border-[hsl(120,28%,26%)] text-[hsl(120,32%,25%)] hover:bg-[hsl(120,28%,90%)]" 
                    : "text-xs"
                  }
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
        </main>

        <BottomNav />
      </div>
    </>
  );
};

export default Index;
