import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filters = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Action", "Comedy", "Drama"]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["Exciting", "Relaxing"]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Netflix", "Prime Video"]);
  const [yearRange, setYearRange] = useState([1980, 2024]);
  const [actor, setActor] = useState("");

  const genres = [
    "Action", "Comedy", "Drama", "Sci-Fi", "Thriller", "Romance", 
    "Horror", "Animation"
  ];

  const moods = [
    "Exciting", "Relaxing", "Thought-provoking", "Romantic", "Funny"
  ];

  const platforms = [
    "Netflix", "Hulu", "Prime Video", "HBO Max"
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
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Filters</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Genre */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Genre</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenres.includes(genre) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => toggleItem(genre, selectedGenres, setSelectedGenres)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </section>

        {/* Mood */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Mood</h2>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Badge
                key={mood}
                variant={selectedMoods.includes(mood) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => toggleItem(mood, selectedMoods, setSelectedMoods)}
              >
                {mood}
              </Badge>
            ))}
          </div>
        </section>

        {/* Actor/Director */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Actor/Director</h2>
          <input
            type="text"
            placeholder="e.g. Tom Hanks, Christopher Nolan"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            className="w-full px-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </section>

        {/* Release Year */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Release Year</h2>
          <div className="px-2">
            <Slider
              value={yearRange}
              onValueChange={setYearRange}
              min={1980}
              max={2024}
              step={1}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </section>

        {/* Streaming Platform */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Streaming Platform</h2>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <Badge
                key={platform}
                variant={selectedPlatforms.includes(platform) ? "default" : "secondary"}
                className="cursor-pointer justify-center py-2"
                onClick={() => toggleItem(platform, selectedPlatforms, setSelectedPlatforms)}
              >
                {platform}
              </Badge>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Language</h2>
          <Select>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Apply Button */}
        <Button 
          className="w-full h-12 text-base"
          onClick={() => navigate("/search")}
        >
          Apply Filters
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Filters;
