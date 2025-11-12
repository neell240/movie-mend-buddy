import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferences, REGIONS, getPlatformsForRegion } from "@/hooks/usePreferences";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Preferences = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = usePreferences();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(preferences.languages);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(preferences.genres);
  const [selectedRegion, setSelectedRegion] = useState<string>(preferences.region);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    preferences.platforms.map(p => parseInt(p))
  );

  const languages = ["All Languages", "English", "Spanish", "French", "German", "Japanese", "Korean"];
  const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Thriller", "Horror", "Romance", "Animation"];
  
  const availablePlatforms = getPlatformsForRegion(selectedRegion);

  const toggleItem = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    setSelected(
      selected.includes(item)
        ? selected.filter(i => i !== item)
        : [...selected, item]
    );
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // Reset platforms when region changes as they might not be available
    const newAvailablePlatforms = getPlatformsForRegion(region);
    const newAvailableIds = newAvailablePlatforms.map(p => p.id);
    setSelectedPlatforms(prev => prev.filter(id => newAvailableIds.includes(id)));
  };

  const handleSave = () => {
    updatePreferences({
      region: selectedRegion,
      languages: selectedLanguages,
      genres: selectedGenres,
      platforms: selectedPlatforms.map(p => p.toString()),
    });
    navigate("/");
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
            Choose your region, languages, genres, and platforms for personalized recommendations
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Region Selection */}
        <section className="mb-8">
          <h3 className="font-semibold mb-3">Region</h3>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Streaming platforms will be filtered based on your region
          </p>
        </section>

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
          <h3 className="font-semibold mb-3">
            Streaming Platforms in {REGIONS.find(r => r.code === selectedRegion)?.name}
          </h3>
          <div className="space-y-2">
            {availablePlatforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
              >
                <span className="font-medium">{platform.name}</span>
                <Switch
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
              </div>
            ))}
          </div>
          {availablePlatforms.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No streaming platforms available for this region
            </p>
          )}
        </section>

        {/* Continue Button */}
        <Button 
          className="w-full h-12 text-base"
          onClick={handleSave}
        >
          Continue
        </Button>
      </main>
    </div>
  );
};

export default Preferences;
