import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Heart, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TMDBMovie, getTMDBImageUrl } from "@/types/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { cn } from "@/lib/utils";

interface EnhancedMovieCardProps {
  movie: TMDBMovie;
  onClick?: () => void;
  platformTag?: string;
  showWatchlistToggle?: boolean;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

export const EnhancedMovieCard = ({ 
  movie, 
  onClick,
  platformTag,
  showWatchlistToggle = true,
}: EnhancedMovieCardProps) => {
  const { isChristmas } = useSeasonal();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isHovered, setIsHovered] = useState(false);
  
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = getTMDBImageUrl(movie.poster_path);
  const inWatchlist = isInWatchlist(movie.id);
  const genres = movie.genre_ids?.slice(0, 2).map(id => GENRE_MAP[id]).filter(Boolean) || [];
  
  const shortOverview = movie.overview 
    ? movie.overview.length > 100 
      ? movie.overview.substring(0, 100) + "..." 
      : movie.overview
    : "No description available.";

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist.mutate(movie.id);
    } else {
      addToWatchlist.mutate({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
      });
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="lg:transform-gpu"
    >
      <Card 
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl lg:rounded-lg",
          "bg-card border-border hover:border-accent/50",
          isHovered && "shadow-2xl"
        )}
        style={isHovered ? {
          boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.2)",
        } : undefined}
        onClick={onClick}
      >
        <div className="aspect-[2/3] relative overflow-hidden">
          <img 
            src={poster} 
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110"
          />
          
          {/* Watchlist toggle - always visible on mobile, hover on desktop */}
          {showWatchlistToggle && (
            <button
              onClick={handleWatchlistToggle}
              className={cn(
                "absolute top-2 right-2 w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all z-20",
                "lg:opacity-0 lg:group-hover:opacity-100",
                inWatchlist
                  ? "bg-accent text-accent-foreground opacity-100"
                  : "bg-black/50 backdrop-blur-sm text-white lg:hover:bg-black/70"
              )}
              aria-label={inWatchlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
            >
              {inWatchlist ? (
                <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              ) : (
                <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              )}
            </button>
          )}
          
          {/* Platform tag */}
          {platformTag && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="text-[10px] font-semibold bg-primary text-primary-foreground">
                On {platformTag}
              </Badge>
            </div>
          )}

          {/* Rating badge - always visible on mobile (bottom-left) */}
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 lg:hidden">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
              <Star className="w-3 h-3 fill-current text-accent" />
              <span className="text-[11px] font-bold text-white">{rating}</span>
            </div>
          </div>
          
          {/* Desktop hover overlay with details */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex-col justify-end p-4",
              "hidden lg:flex",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            )}
          >
            <p className="text-xs mb-3 line-clamp-3 text-gray-300">
              {shortOverview}
            </p>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{rating}</span>
              </div>
              {movie.vote_count && (
                <span className="text-xs text-gray-400">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <Badge 
                  key={genre}
                  variant="outline"
                  className="text-[10px] bg-white/10 border-white/20 text-white"
                >
                  {genre}
                </Badge>
              ))}
              <Badge 
                variant="outline"
                className="text-[10px] bg-white/10 border-white/20 text-white"
              >
                {movie.original_language.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          {/* Play button - desktop only, on hover */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
              "hidden lg:flex",
              "w-14 h-14 rounded-full items-center justify-center",
              "bg-accent text-accent-foreground shadow-lg",
              "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
              "transition-all duration-200"
            )}
            style={{
              boxShadow: "0 4px 20px hsl(42 85% 60% / 0.5)",
            }}
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>
        
        {/* Card footer */}
        <div className="p-2.5 lg:p-3">
          <h3 className="font-semibold text-xs lg:text-sm line-clamp-1 mb-0.5 lg:mb-1 text-foreground">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs text-muted-foreground mb-1.5 lg:mb-2">
            <span>{year}</span>
            <span>•</span>
            <span>{movie.original_language.toUpperCase()}</span>
            {genres[0] && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline truncate">{genres[0]}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {/* Rating - hidden on mobile (shown as overlay badge instead) */}
            <div className="hidden lg:flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current text-accent" />
              <span className="text-xs font-semibold text-foreground">{rating}</span>
            </div>

            {/* Mobile: show genre chip */}
            {genres[0] && (
              <span className="lg:hidden text-[10px] text-muted-foreground bg-secondary/50 rounded px-1.5 py-0.5">
                {genres[0]}
              </span>
            )}
            
            {inWatchlist && (
              <Badge 
                variant="secondary"
                className="text-[9px] lg:text-[10px] px-1.5 py-0"
              >
                <Heart className="w-2 h-2 lg:w-2.5 lg:h-2.5 mr-0.5 fill-current" />
                Saved
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
