import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TMDBMovie } from "@/types/tmdb";
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

  const watchlistMovies: Array<TMDBMovie & { status: string }> = [
    {
      id: 1,
      title: "The Midnight Bloom",
      original_title: "The Midnight Bloom",
      overview: "A captivating drama fantasy",
      poster_path: "/photo-1536440136628",
      backdrop_path: null,
      release_date: "2024-01-01",
      vote_average: 8.8,
      vote_count: 1200,
      genre_ids: [18, 14],
      original_language: "en",
      popularity: 85.5,
      adult: false,
      status: "Reminded"
    },
    {
      id: 2,
      title: "Echoes of the Past",
      original_title: "Echoes of the Past",
      overview: "A thrilling mystery",
      poster_path: "/photo-1594908900066",
      backdrop_path: null,
      release_date: "2023-01-01",
      vote_average: 8.6,
      vote_count: 980,
      genre_ids: [53, 9648],
      original_language: "en",
      popularity: 78.2,
      adult: false,
      status: "Reminded"
    },
    {
      id: 3,
      title: "Starlight Serenade",
      original_title: "Starlight Serenade",
      overview: "A romantic drama",
      poster_path: "/photo-1478720568477",
      backdrop_path: null,
      release_date: "2024-01-01",
      vote_average: 8.4,
      vote_count: 1100,
      genre_ids: [10749, 18],
      original_language: "en",
      popularity: 82.0,
      adult: false,
      status: "Reminded"
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
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
            <Select defaultValue="genre">
              <SelectTrigger className="w-24 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="genre">Genre</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-24 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="reminded">Reminded</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="2024">
              <SelectTrigger className="w-24 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {watchlistMovies.map(({ status, ...movie }) => (
            <div key={movie.id} className="space-y-2">
              <MovieCard
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
              <Badge 
                variant={status === "Reminded" ? "destructive" : "secondary"}
                className="w-full justify-center"
              >
                {status}
              </Badge>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Watchlist;
