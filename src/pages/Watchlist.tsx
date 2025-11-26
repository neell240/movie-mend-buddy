import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "@/hooks/useWatchlist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Watchlist = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { watchlist, isLoading, markAsWatched } = useWatchlist();

  const filteredMovies = watchlist.filter(item => {
    const matchesSearch = item.movie_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-bold mb-4">My Watchlist</h1>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your watchlist..."
              className="pl-10 bg-secondary border-border"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="want_to_watch">Want to Watch</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No movies in your watchlist yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredMovies.map((item) => (
              <div key={item.id} className="space-y-2">
                <MovieCard
                  movie={{
                    id: item.movie_id,
                    title: item.movie_title,
                    original_title: item.movie_title,
                    poster_path: item.movie_poster || '',
                    backdrop_path: null,
                    overview: '',
                    release_date: '',
                    vote_average: 0,
                    vote_count: 0,
                    genre_ids: [],
                    original_language: 'en',
                    popularity: 0,
                    adult: false,
                  }}
                  onClick={() => navigate(`/movie/${item.movie_id}`)}
                />
                <div className="flex gap-2">
                  <Badge 
                    variant={item.status === "watched" ? "secondary" : "destructive"}
                    className="flex-1 justify-center"
                  >
                    {item.status === "watched" ? "Watched" : "Want to Watch"}
                  </Badge>
                  {item.status !== "watched" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsWatched.mutate(item.movie_id)}
                      className="text-xs"
                    >
                      Mark Watched
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Watchlist;
