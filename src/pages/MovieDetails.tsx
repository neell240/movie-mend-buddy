import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Bookmark, Share2, Play, Star, Clock, Calendar, Users, Film } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMovieDetails } from "@/hooks/useTMDB";
import { useWatchlist } from "@/hooks/useWatchlist";
import { getTMDBImageUrl, TMDB_BACKDROP_SIZE, TMDB_PROFILE_SIZE } from "@/types/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { cn } from "@/lib/utils";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: movie, isLoading } = useMovieDetails(id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { isChristmas } = useSeasonal();
  
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

    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share");
        }
      }
    } else {
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
      <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16">
        <Skeleton className="w-full h-72 lg:h-96" />
        <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
          <div className="flex gap-6">
            <Skeleton className="w-32 h-48 rounded-xl flex-shrink-0" />
            <div className="flex-1 pt-24">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
            </div>
          </div>
          <Skeleton className="h-20 w-full mt-6" />
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
  const genres = movie.genres || [];
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A';
  const poster = getTMDBImageUrl(movie.poster_path);
  const backdrop = getTMDBImageUrl(movie.backdrop_path, TMDB_BACKDROP_SIZE);
  
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const trailerUrl = trailer ? `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg` : backdrop;
  
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const director = movie.credits?.crew?.find(c => c.job === 'Director');

  return (
    <div className="min-h-screen pb-20 lg:pb-6 lg:pt-16">
      {/* Hero Backdrop */}
      <div className="relative w-full h-72 lg:h-[28rem]">
        <img 
          src={backdrop} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        
        {/* Floating header buttons */}
        <header className="absolute top-0 left-0 right-0 z-40 lg:top-16">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleShare}
                className="bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleWatchlistToggle}
                className={cn(
                  "bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full",
                  inWatchlist && "bg-primary/80 hover:bg-primary"
                )}
              >
                <Bookmark 
                  className="w-5 h-5" 
                  fill={inWatchlist ? "currentColor" : "none"}
                />
              </Button>
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-32 lg:-mt-48 relative z-10">
        {/* Movie Info Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0 self-start">
            <div className={cn(
              "relative w-36 lg:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl",
              isChristmas && "ring-2 ring-[hsl(var(--christmas-gold))] ring-offset-2 ring-offset-background"
            )}>
              <img 
                src={poster} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title & Quick Info */}
          <div className="flex-1 pt-4 lg:pt-20">
            <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-foreground">{movie.title}</h1>
            
            {/* Meta info pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground border-muted-foreground/30">
                <Calendar className="w-3 h-3" />
                {year}
              </Badge>
              {movie.runtime && (
                <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground border-muted-foreground/30">
                  <Clock className="w-3 h-3" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground border-muted-foreground/30">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {rating}/5
              </Badge>
            </div>

            {/* Genre badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.slice(0, 4).map((genre) => (
                <Badge 
                  key={genre.id} 
                  className={cn(
                    "text-xs",
                    isChristmas 
                      ? "bg-[hsl(var(--christmas-cranberry))] text-white" 
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>

            {movie.tagline && (
              <p className="text-sm italic text-muted-foreground mb-3">"{movie.tagline}"</p>
            )}

            {/* Add to Watchlist CTA (Mobile) */}
            <Button 
              onClick={handleWatchlistToggle}
              className={cn(
                "w-full lg:w-auto mt-2",
                inWatchlist ? "bg-muted text-muted-foreground hover:bg-muted/80" : ""
              )}
            >
              <Bookmark className="w-4 h-4 mr-2" fill={inWatchlist ? "currentColor" : "none"} />
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </div>

        {/* Content sections */}
        <div className="mt-8 space-y-6">
          {/* Overview */}
          <section className={cn(
            "rounded-2xl p-5",
            isChristmas ? "bg-card border border-border" : "bg-card/50 backdrop-blur-sm"
          )}>
            <h3 className="font-semibold mb-3 text-card-foreground flex items-center gap-2">
              <Film className="w-4 h-4" />
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.overview}
            </p>
          </section>

          {/* Rating Card */}
          <section className={cn(
            "rounded-2xl p-5",
            isChristmas ? "bg-card border border-border" : "bg-card/50 backdrop-blur-sm"
          )}>
            <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Ratings & Stats
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* User Rating */}
              <div className="text-center p-4 rounded-xl bg-background/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  <span className="text-2xl font-bold text-card-foreground">{rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">User Rating</p>
              </div>
              
              {/* TMDB Rating */}
              <div className="text-center p-4 rounded-xl bg-background/50">
                <span className="text-2xl font-bold text-card-foreground">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/10</span>
                <p className="text-xs text-muted-foreground">TMDB Score</p>
              </div>
              
              {/* Vote Count */}
              <div className="text-center p-4 rounded-xl bg-background/50">
                <span className="text-2xl font-bold text-card-foreground">
                  {movie.vote_count && movie.vote_count > 1000 
                    ? `${(movie.vote_count / 1000).toFixed(1)}K` 
                    : movie.vote_count?.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground">Total Votes</p>
              </div>
              
              {/* Popularity */}
              <div className="text-center p-4 rounded-xl bg-background/50">
                <span className="text-2xl font-bold text-card-foreground">
                  {movie.popularity ? Math.round(movie.popularity) : 'N/A'}
                </span>
                <p className="text-xs text-muted-foreground">Popularity</p>
              </div>
            </div>
          </section>

          {/* Trailer */}
          {trailer && (
            <section>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Trailer
              </h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={trailerUrl} 
                  alt="Trailer"
                  className="w-full h-full object-cover"
                />
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                  </div>
                </a>
              </div>
            </section>
          )}

          {/* Cast & Crew */}
          {(cast.length > 0 || director) && (
            <section className={cn(
              "rounded-2xl p-5",
              isChristmas ? "bg-card border border-border" : "bg-card/50 backdrop-blur-sm"
            )}>
              <h3 className="font-semibold mb-4 text-card-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Cast & Crew
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {director && (
                  <div className="flex-shrink-0 text-center group">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-2 ring-primary ring-offset-2 ring-offset-card shadow-lg group-hover:scale-105 transition-transform">
                      <img 
                        src={getTMDBImageUrl(director.profile_path, TMDB_PROFILE_SIZE)} 
                        alt={director.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold line-clamp-1 w-20 text-card-foreground">{director.name}</p>
                    <p className="text-xs text-primary font-medium">Director</p>
                  </div>
                )}
                {cast.map((person) => (
                  <div key={person.id} className="flex-shrink-0 text-center group">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-2 ring-border ring-offset-2 ring-offset-card shadow-md group-hover:scale-105 transition-transform">
                      <img 
                        src={getTMDBImageUrl(person.profile_path, TMDB_PROFILE_SIZE)} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium line-clamp-1 w-20 text-card-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 w-20">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Production */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <section className={cn(
              "rounded-2xl p-5",
              isChristmas ? "bg-card border border-border" : "bg-card/50 backdrop-blur-sm"
            )}>
              <h3 className="font-semibold mb-3 text-card-foreground">Production</h3>
              <div className="flex flex-wrap gap-2">
                {movie.production_companies.slice(0, 4).map((company) => (
                  <Badge key={company.id} variant="secondary" className="text-secondary-foreground">
                    {company.name}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MovieDetails;
