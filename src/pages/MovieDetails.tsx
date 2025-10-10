import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Bookmark, Share2, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const movie = {
    title: "The Midnight Bloom",
    year: 2024,
    genre: "Drama",
    rating: 4.6,
    reviews: "1,234 reviews",
    description: "In a world where dreams and reality intertwine, a young cartographer must navigate through an enchanting landscape, one that confronts her deepest fears and unlocks the power of her imagination.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    trailer: "https://images.unsplash.com/photo-1574267432644-f74f48827c4e?w=800&h=450&fit=crop",
    cast: [
      {
        name: "Ethan Blake",
        role: "Actor",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      },
      {
        name: "Olivia Hayes",
        role: "Actress",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
      },
      {
        name: "Julian Reed",
        role: "Director",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
      }
    ],
    streaming: [
      { platform: "Prime Video", available: true },
      { platform: "Hulu", available: false }
    ],
    ratingBreakdown: [
      { stars: 5, percentage: 60 },
      { stars: 4, percentage: 25 },
      { stars: 3, percentage: 10 },
      { stars: 2, percentage: 3 },
      { stars: 1, percentage: 2 }
    ]
  };

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
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Movie Poster */}
        <div className="px-4 mb-6">
          <div className="relative aspect-[2/3] max-w-xs mx-auto rounded-2xl overflow-hidden">
            <img 
              src={movie.poster} 
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
              {movie.year} • {movie.genre}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.description}
            </p>
          </div>

          {/* Ratings */}
          <div className="mb-6 bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold mb-3">Ratings</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-bold">{movie.rating}</span>
              <div className="mb-1">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(movie.rating) 
                          ? "text-yellow-500" 
                          : "text-muted"
                      }`}
                    >
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{movie.reviews}</p>
              </div>
            </div>
            <div className="space-y-2">
              {movie.ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <span className="text-xs w-6">{rating.stars}★</span>
                  <Progress value={rating.percentage} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {rating.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trailer */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Trailer</h3>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border">
              <img 
                src={movie.trailer} 
                alt="Trailer"
                className="w-full h-full object-cover"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                  <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                </div>
              </button>
            </div>
          </div>

          {/* Cast & Crew */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Cast & Crew</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {movie.cast.map((person) => (
                <div key={person.name} className="flex-shrink-0 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-border">
                    <img 
                      src={person.image} 
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium line-clamp-1">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Streaming */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Streaming</h3>
            <div className="space-y-2">
              {movie.streaming.map((service) => (
                <div 
                  key={service.platform}
                  className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{service.platform}</span>
                  </div>
                  {service.available && (
                    <Badge variant="default" className="text-xs">
                      Stream on {service.platform}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MovieDetails;
