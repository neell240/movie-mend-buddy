import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, SlidersHorizontal, X, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ["Genre", "Mood", "Language"];
  
  const featuredMovies = [
    {
      id: 1,
      title: "The Midnight Bloom",
      year: 2024,
      rating: 8.8,
      language: "English",
      genres: ["Drama", "Fantasy"],
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Echoes of the Past",
      year: 2024,
      rating: 8.6,
      language: "English",
      genres: ["Thriller", "Mystery"],
      poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop"
    }
  ];

  const searchResults = [
    {
      id: 3,
      title: "The Last Stand",
      year: 2024,
      rating: 8.4,
      imdb: "8.4",
      rt: "92%",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop"
    },
    {
      id: 4,
      title: "City of Shadows",
      year: 2024,
      rating: 8.2,
      imdb: "8.2",
      rt: "89%",
      poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Midnight Pursuit",
      year: 2023,
      rating: 8.1,
      imdb: "8.1",
      rt: "87%",
      poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Crimson Tide",
      year: 2023,
      rating: 8.3,
      imdb: "8.3",
      rt: "90%",
      poster: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe the kind of movie you want"
                className="pl-10 pr-10 bg-secondary border-border"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer whitespace-nowrap"
                onClick={() => navigate("/filters")}
              >
                {filter}
              </Badge>
            ))}
            <Button 
              size="sm" 
              variant="secondary"
              className="gap-2 whitespace-nowrap"
              onClick={() => navigate("/filters")}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {!searchQuery ? (
          <>
            {/* Featured Picks */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Featured Picks</h2>
              <div className="grid grid-cols-2 gap-4">
                {featuredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Search Results */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Results</h2>
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} movies
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map((movie) => (
                  <div 
                    key={movie.id}
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <Badge variant="secondary" className="text-xs bg-black/60 backdrop-blur-sm">
                          {movie.imdb}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-black/60 backdrop-blur-sm">
                          {movie.rt}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{movie.year}</p>
                      </div>
                    </div>
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-primary-foreground fill-current ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
