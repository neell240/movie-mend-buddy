import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Star, Heart, Clock, Plus, Check } from "lucide-react";
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

// Genre ID to name mapping (common TMDB genres)
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
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
  
  // Get genre names from IDs
  const genres = movie.genre_ids?.slice(0, 2).map(id => GENRE_MAP[id]).filter(Boolean) || [];
  
  // Truncate overview for hover display
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-300",
          isChristmas 
            ? "bg-[hsl(355,45%,18%)] border-[hsl(355,40%,28%)] hover:border-[hsl(42,85%,65%)/0.5]"
            : "bg-card border-border hover:border-primary/50",
          isHovered && "shadow-2xl"
        )}
        style={isHovered ? {
          boxShadow: isChristmas 
            ? "0 20px 40px -15px hsl(355 72% 20% / 0.5)"
            : "0 20px 40px -15px hsl(var(--primary) / 0.2)",
        } : undefined}
        onClick={onClick}
      >
        <div className="aspect-[2/3] relative overflow-hidden">
          {/* Poster image with lazy loading */}
          <img 
            src={poster} 
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Watchlist toggle button */}
          {showWatchlistToggle && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered || inWatchlist ? 1 : 0, scale: 1 }}
              onClick={handleWatchlistToggle}
              className={cn(
                "absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all z-20",
                inWatchlist
                  ? isChristmas 
                    ? "bg-[hsl(42,85%,65%)] text-[hsl(355,45%,12%)]"
                    : "bg-primary text-primary-foreground"
                  : "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
              )}
              aria-label={inWatchlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {inWatchlist ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.button>
          )}
          
          {/* Platform tag */}
          {platformTag && (
            <div className="absolute top-2 left-2 z-10">
              <Badge 
                className={cn(
                  "text-[10px] font-semibold",
                  isChristmas
                    ? "bg-[hsl(355,72%,45%)] text-white"
                    : "bg-primary text-primary-foreground"
                )}
              >
                On {platformTag}
              </Badge>
            </div>
          )}
          
          {/* Hover overlay with details */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Synopsis on hover */}
            <p className={cn(
              "text-xs mb-3 line-clamp-3",
              isChristmas ? "text-[hsl(42,45%,85%)]" : "text-gray-300"
            )}>
              {shortOverview}
            </p>
            
            {/* Rating & runtime row */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{rating}</span>
              </div>
              {movie.vote_count && (
                <span className="text-xs text-gray-400">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>
            
            {/* Genre tags */}
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
          </motion.div>
          
          {/* Play button */}
          <motion.button 
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10",
              isChristmas
                ? "bg-[hsl(42,85%,65%)] text-[hsl(355,45%,12%)]"
                : "bg-primary/90 text-primary-foreground"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </motion.button>
        </div>
        
        {/* Card footer */}
        <div className={cn(
          "p-3",
          isChristmas ? "bg-[hsl(355,45%,15%)]" : ""
        )}>
          <h3 className={cn(
            "font-semibold text-sm line-clamp-1 mb-1",
            isChristmas ? "text-[hsl(45,60%,96%)]" : "text-foreground"
          )}>
            {movie.title}
          </h3>
          
          <div className={cn(
            "flex items-center gap-2 text-xs mb-2",
            isChristmas ? "text-[hsl(42,45%,70%)]" : "text-muted-foreground"
          )}>
            <span>{year}</span>
            <span>•</span>
            <span>{movie.original_language.toUpperCase()}</span>
            {genres[0] && (
              <>
                <span>•</span>
                <span className="truncate">{genres[0]}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className={cn(
                "w-3.5 h-3.5 fill-current",
                isChristmas ? "text-[hsl(42,85%,65%)]" : "text-yellow-500"
              )} />
              <span className={cn(
                "text-xs font-semibold",
                isChristmas ? "text-[hsl(42,85%,65%)]" : "text-foreground"
              )}>
                {rating}
              </span>
            </div>
            
            {inWatchlist && (
              <Badge 
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  isChristmas 
                    ? "bg-[hsl(42,85%,65%)/0.2] text-[hsl(42,85%,70%)]"
                    : ""
                )}
              >
                <Heart className="w-2.5 h-2.5 mr-1 fill-current" />
                Saved
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
