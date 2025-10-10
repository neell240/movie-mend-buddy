import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
  const navigate = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Comedy", "Drama"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const languages = ["English", "Spanish", "French", "German"];
  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Thriller", "Horror"];
  const platforms = [
    { name: "Streaming Service A", enabled: false },
    { name: "Prime Video", enabled: true },
    { name: "Hulu", enabled: true }
  ];

  const toggleItem = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    setSelected(
      selected.includes(item)
        ? selected.filter(i => i !== item)
        : [...selected, item]
    );
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">MovieMend</h1>
          </div>
          <h2 className="text-2xl font-bold text-center mb-1">Select Your Preferences</h2>
          <p className="text-sm text-muted-foreground text-center">
            Choose languages, genres, and platforms for personalized recommendations
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Languages */}
        <section className="mb-8">
          <h3 className="font-semibold mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <Badge
                key={language}
                variant={selectedLanguages.includes(language) ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2"
                onClick={() => toggleItem(language, selectedLanguages, setSelectedLanguages)}
              >
                {language}
              </Badge>
            ))}
          </div>
        </section>

        {/* Favorite Genres */}
        <section className="mb-8">
          <h3 className="font-semibold mb-3">Favorite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2"
                onClick={() => toggleItem(genre, selectedGenres, setSelectedGenres)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </section>

        {/* Streaming Platforms */}
        <section className="mb-8">
          <h3 className="font-semibold mb-3">Streaming Platforms</h3>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
              >
                <span className="font-medium">{platform.name}</span>
                <Switch defaultChecked={platform.enabled} />
              </div>
            ))}
          </div>
        </section>

        {/* Continue Button */}
        <Button 
          className="w-full h-12 text-base"
          onClick={() => navigate("/")}
        >
          Continue
        </Button>
      </main>
    </div>
  );
};

export default Preferences;
