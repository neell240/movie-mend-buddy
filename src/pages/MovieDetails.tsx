import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Bookmark, Share2, Play, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieDetails } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { getTMDBImageUrl, TMDB_BACKDROP_SIZE, TMDB_PROFILE_SIZE } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: movie, isLoading } = useMovieDetails(id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  
  const inWatchlist = id ? isInWatchlist(parseInt(id)) : false;

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
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

  const handleShare = async () => {
    if (!movie) return;

    const shareUrl = window.location.href;
    const shareText = `Check out ${movie.title} (${year})`;

    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4">
          <Skeleton className="aspect-[2/3] max-w-xs mx-auto rounded-2xl mb-6" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <p>Movie not found</p>
      </div>
    );
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A';
  const poster = getTMDBImageUrl(movie.poster_path);
  const backdrop = getTMDBImageUrl(movie.backdrop_path, TMDB_BACKDROP_SIZE);
  
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const trailerUrl = trailer ? `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg` : backdrop;
  
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const director = movie.credits?.crew?.find(c => c.job === 'Director');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleWatchlistToggle}
            >
              <Bookmark 
                className="w-5 h-5" 
                fill={inWatchlist ? "currentColor" : "none"}
              />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Movie Poster */}
        <div className="px-4 mb-6">
          <div className="relative aspect-[2/3] max-w-xs mx-auto rounded-2xl overflow-hidden">
            <img 
              src={poster} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="px-4">
          {/* Title & Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">
              {year} • {genres}
            </p>
            {movie.tagline && (
              <p className="text-sm italic text-muted-foreground mb-3">"{movie.tagline}"</p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.overview}
            </p>
          </div>

          {/* Ratings */}
          <div className="mb-6 bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold mb-3">Rating</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
                <span className="text-4xl font-bold">{rating}</span>
                <span className="text-sm text-muted-foreground">/ 5</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Based on {movie.vote_count?.toLocaleString()} votes
                </p>
                <p className="text-xs text-muted-foreground">
                  TMDB Rating: {movie.vote_average?.toFixed(1)}/10
                </p>
              </div>
            </div>
            {movie.runtime && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </p>
              </div>
            )}
          </div>

          {/* Trailer */}
          {trailer && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Trailer</h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border">
                <img 
                  src={trailerUrl} 
                  alt="Trailer"
                  className="w-full h-full object-cover"
                />
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Cast & Crew */}
          {(cast.length > 0 || director) && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Cast & Crew</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {director && (
                  <div className="flex-shrink-0 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-primary">
                      <img 
                        src={getTMDBImageUrl(director.profile_path, TMDB_PROFILE_SIZE)} 
                        alt={director.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium line-clamp-1 w-20">{director.name}</p>
                    <p className="text-xs text-muted-foreground">Director</p>
                  </div>
                )}
                {cast.map((person) => (
                  <div key={person.id} className="flex-shrink-0 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-border">
                      <img 
                        src={getTMDBImageUrl(person.profile_path, TMDB_PROFILE_SIZE)} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium line-clamp-1 w-20">{person.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 w-20">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Production</h3>
              <div className="flex flex-wrap gap-2">
                {movie.production_companies.slice(0, 4).map((company) => (
                  <Badge key={company.id} variant="secondary">
                    {company.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MovieDetails;
