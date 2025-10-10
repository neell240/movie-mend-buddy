import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const watchlistMovies = [
    {
      id: 1,
      title: "The Midnight Bloom",
      year: 2024,
      rating: 8.8,
      language: "English",
      genres: ["Drama", "Fantasy"],
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
      status: "Reminded"
    },
    {
      id: 2,
      title: "Echoes of the Past",
      year: 2023,
      rating: 8.6,
      language: "English",
      genres: ["Thriller", "Mystery"],
      poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
      status: "Reminded"
    },
    {
      id: 3,
      title: "Starlight Serenade",
      year: 2024,
      rating: 8.4,
      language: "English",
      genres: ["Romance", "Drama"],
      poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
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
          {watchlistMovies.map((movie) => (
            <div key={movie.id} className="space-y-2">
              <MovieCard
                {...movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
              <Badge 
                variant={movie.status === "Reminded" ? "destructive" : "secondary"}
                className="w-full justify-center"
              >
                {movie.status}
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
