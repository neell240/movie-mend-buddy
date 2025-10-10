import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const genres = ["Romantic", "Thriller", "Comedy", "Action", "Crime", "Spanish"];
  
  const recentMovies = [
    {
      id: 1,
      title: "Love in Paris",
      year: 2023,
      rating: 8.2,
      language: "English",
      genres: ["Romance", "Drama"],
      poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop"
    },
    {
      id: 2,
      title: "The Silent Witness",
      year: 2023,
      rating: 8.4,
      language: "Spanish",
      genres: ["Thriller", "Mystery"],
      poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop"
    }
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">MovieMend</h1>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate("/preferences")}
              className="text-xs"
            >
              Setup
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* AI Assistant Section */}
        <section className="mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Your movie buddy</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm mb-3">Hi Liam! What kind of movie are you in the mood for?</p>
              <div className="relative">
                <Input 
                  placeholder="Ask me anything..."
                  className="bg-secondary border-border pr-12"
                />
                <Button 
                  size="sm"
                  className="absolute right-1 top-1 h-8"
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Requests */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Recent Requests</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm">Recommend movie for a date night</p>
          </div>
        </section>

        {/* AI Response */}
        <section>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">AI Response</h3>
          <div className="grid grid-cols-2 gap-4">
            {recentMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
