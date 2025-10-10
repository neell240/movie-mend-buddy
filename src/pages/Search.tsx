import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchMovies, useDiscoverMovies } from "@/hooks/useTMDB";
import { Skeleton } from "@/components/ui/skeleton";
import { getTMDBImageUrl } from "@/types/tmdb";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: searchData, isLoading: isSearching } = useSearchMovies(debouncedQuery);
  const { data: discoverData, isLoading: isLoadingDiscover } = useDiscoverMovies();

  const filters = ["Genre", "Mood", "Language"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        {!debouncedQuery ? (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4">Popular Movies</h2>
            {isLoadingDiscover ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {discoverData?.results?.slice(0, 6).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Results</h2>
              <span className="text-sm text-muted-foreground">
                {searchData?.results?.length || 0} movies
              </span>
            </div>
            {isSearching ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {searchData?.results?.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
