import { BottomNav } from "@/components/BottomNav";
import { EnhancedMovieCard } from "@/components/EnhancedMovieCard";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { ChatWidget } from "@/components/ChatWidget";
import { HeroCTA } from "@/components/HeroCTA";
import { SimilarToWatchlistSection } from "@/components/ForYouSection";
import { WinterHeroBanner } from "@/components/WinterHeroBanner";
import { ValentineHeroBanner } from "@/components/valentine/ValentineHeroBanner";
import { ValentineDailyPick } from "@/components/valentine/ValentineDailyPick";
import { ValentineMovieSuggestions } from "@/components/valentine/ValentineMovieSuggestions";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings, Wrench, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDiscoverMovies } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/hooks/usePreferences";
import { NotificationBell } from "@/components/NotificationBell";
import { useSeasonal } from "@/hooks/useChristmasMode";
import booviAvatar from "@/assets/boovi-avatar.png";
const Index = () => {
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  const { isChristmas, isNewYear, isValentine } = useSeasonal();
  
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

  // Determine theme for styling
  const isSeasonalTheme = isChristmas || isValentine;

  return (
    <>
      <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16 christmas-grain">
        {/* Header */}
        <header 
          className="sticky top-0 z-40 backdrop-blur-lg border-b lg:top-16"
          style={isValentine ? {
            background: "linear-gradient(to right, hsl(350 45% 14% / 0.95), hsl(345 40% 12% / 0.95))",
            borderColor: "hsl(350 40% 25%)",
          } : isChristmas ? {
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
                {isValentine ? (
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
                ) : isChristmas ? (
                  <img src={booviAvatar} alt="Boovi" className="w-10 h-10 object-contain" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
                <h1 
                  className="text-xl font-bold gold-underline"
                  style={isSeasonalTheme ? { 
                    color: "hsl(45 60% 96%)",
                    textShadow: "0 2px 8px hsl(355 50% 10% / 0.4)"
                  } : {
                    color: "hsl(45 60% 96%)",
                  }}
                >
                  MovieMend
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button
                  size="icon" 
                  variant="ghost"
                  onClick={() => navigate("/preferences")}
                  title="Setup Preferences"
                  className={isSeasonalTheme ? "text-[hsl(45,60%,92%)] hover:text-[hsl(42,85%,70%)] hover:bg-[hsl(355,45%,25%)]" : ""}
                >
                  <Wrench className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => navigate("/settings")}
                  title="Settings"
                  className={isSeasonalTheme ? "text-[hsl(45,60%,92%)] hover:text-[hsl(42,85%,70%)] hover:bg-[hsl(355,45%,25%)]" : ""}
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
          {/* Valentine Hero Banner, Daily Pick & Suggestions */}
          {isValentine && (
            <>
              <ValentineHeroBanner />
              <ValentineDailyPick />
              <ValentineMovieSuggestions />
            </>
          )}

          {/* Winter Hero Banner */}
          {isChristmas && <WinterHeroBanner />}

          {/* Hero CTA with buttons */}
          <HeroCTA />

          {/* Personalized Recommendations - Always visible */}
          <PersonalizedRecommendations />

          {/* Similar to Watchlist Section */}
          <SimilarToWatchlistSection />

          {/* Movies Section */}
          <section 
            className={isSeasonalTheme ? (isValentine ? "valentine-card p-5" : "cozy-card p-5") : ""}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className={isSeasonalTheme
                  ? "text-base font-bold text-[hsl(120,32%,16%)] gold-underline-short" 
                  : "text-sm font-semibold text-muted-foreground gold-underline-short"
                }
              >
                {preferences.platforms.length > 0 
                  ? `Available on Your Platforms` 
                  : 'Popular Movies'}
              </h3>
              {preferences.platforms.length === 0 && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => navigate("/preferences")}
                  className={isValentine 
                    ? "text-xs bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg animate-pulse"
                    : isChristmas 
                      ? "text-xs bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white font-semibold shadow-lg animate-pulse" 
                      : "text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
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
                  <EnhancedMovieCard
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
        
        {/* Floating Chat Widget */}
        <ChatWidget />
      </div>
    </>
  );
};

export default Index;
