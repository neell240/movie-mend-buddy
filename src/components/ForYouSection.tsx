import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedMovieCard } from "@/components/EnhancedMovieCard";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { TMDBMovie } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface ForYouSectionProps {
  movies: TMDBMovie[];
  basedOnMovie?: string;
  title?: string;
  subtitle?: string;
}

export const ForYouSection = ({ 
  movies, 
  basedOnMovie,
  title = "For You",
  subtitle,
}: ForYouSectionProps) => {
  const navigate = useNavigate();
  const { isChristmas } = useSeasonal();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative",
        isChristmas && "cozy-card p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isChristmas 
              ? "bg-[hsl(42,85%,65%)/0.2]"
              : "bg-primary/10"
          )}>
            <Sparkles className={cn(
              "w-4 h-4",
              isChristmas ? "text-[hsl(42,85%,65%)]" : "text-primary"
            )} />
          </div>
          <div>
            <h3 className={cn(
              "font-bold text-base",
              isChristmas ? "text-[hsl(20,15%,18%)]" : "text-foreground"
            )}>
              {title}
            </h3>
            {(basedOnMovie || subtitle) && (
              <p className={cn(
                "text-xs",
                isChristmas ? "text-[hsl(20,15%,45%)]" : "text-muted-foreground"
              )}>
                {subtitle || `Because you liked ${basedOnMovie}`}
              </p>
            )}
          </div>
        </div>
        
        {/* Scroll buttons */}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll("left")}
            className={cn(
              "w-8 h-8 rounded-full",
              isChristmas && "border-[hsl(355,40%,35%)] hover:bg-[hsl(355,45%,25%)] text-[hsl(20,15%,30%)]"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll("right")}
            className={cn(
              "w-8 h-8 rounded-full",
              isChristmas && "border-[hsl(355,40%,35%)] hover:bg-[hsl(355,45%,25%)] text-[hsl(20,15%,30%)]"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable carousel */}
      <div className="relative -mx-4 px-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[160px]"
            >
              <EnhancedMovieCard
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Scroll fade indicators */}
        <div className="absolute top-0 bottom-4 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none lg:hidden" />
        <div className="absolute top-0 bottom-4 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden" />
      </div>
    </motion.section>
  );
};

// Similar to watchlist section
export const SimilarToWatchlistSection = () => {
  const navigate = useNavigate();
  const { isChristmas } = useSeasonal();
  const { watchlist } = useWatchlist();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock data - in production this would come from a recommendation API
  // based on the user's watchlist movies
  const mockSimilarMovies: Partial<TMDBMovie>[] = [
    {
      id: 157336,
      title: "Interstellar",
      overview: "A team of explorers travel through a wormhole in space...",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      vote_average: 8.4,
      release_date: "2014-11-05",
      original_language: "en",
      genre_ids: [12, 18, 878],
      vote_count: 32000,
    },
    {
      id: 550,
      title: "Fight Club",
      overview: "A depressed man suffering from insomnia meets a strange soap salesman...",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      vote_average: 8.4,
      release_date: "1999-10-15",
      original_language: "en",
      genre_ids: [18],
      vote_count: 26000,
    },
    {
      id: 27205,
      title: "Inception",
      overview: "A thief who steals corporate secrets through dream-sharing technology...",
      poster_path: "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
      vote_average: 8.4,
      release_date: "2010-07-15",
      original_language: "en",
      genre_ids: [28, 878, 12],
      vote_count: 34000,
    },
    {
      id: 238,
      title: "The Godfather",
      overview: "The aging patriarch of an organized crime dynasty transfers control...",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      vote_average: 8.7,
      release_date: "1972-03-14",
      original_language: "en",
      genre_ids: [18, 80],
      vote_count: 18000,
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Only show if user has items in watchlist
  if (watchlist.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative",
        isChristmas && "cozy-card p-5"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isChristmas 
              ? "bg-[hsl(355,72%,45%)/0.2]"
              : "bg-primary/10"
          )}>
            <Heart className={cn(
              "w-4 h-4",
              isChristmas ? "text-[hsl(355,72%,50%)]" : "text-primary"
            )} />
          </div>
          <div>
            <h3 className={cn(
              "font-bold text-base",
              isChristmas ? "text-[hsl(20,15%,18%)]" : "text-foreground"
            )}>
              Similar to Your Watchlist
            </h3>
            <p className={cn(
              "text-xs",
              isChristmas ? "text-[hsl(20,15%,45%)]" : "text-muted-foreground"
            )}>
              Based on {watchlist.length} saved movies
            </p>
          </div>
        </div>
        
        {/* Scroll buttons */}
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll("left")}
            className={cn(
              "w-8 h-8 rounded-full",
              isChristmas && "border-[hsl(355,40%,35%)] hover:bg-[hsl(355,45%,25%)] text-[hsl(20,15%,30%)]"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => scroll("right")}
            className={cn(
              "w-8 h-8 rounded-full",
              isChristmas && "border-[hsl(355,40%,35%)] hover:bg-[hsl(355,45%,25%)] text-[hsl(20,15%,30%)]"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable carousel */}
      <div className="relative -mx-4 px-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {mockSimilarMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[160px]"
            >
              <EnhancedMovieCard
                movie={movie as TMDBMovie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Scroll fade indicators */}
        <div className="absolute top-0 bottom-4 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none lg:hidden" />
        <div className="absolute top-0 bottom-4 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden" />
      </div>
    </motion.section>
  );
};
