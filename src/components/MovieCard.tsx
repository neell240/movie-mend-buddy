import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MovieCardProps {
  title: string;
  year: number;
  rating: number;
  language: string;
  genres: string[];
  poster: string;
  onClick?: () => void;
}

export const MovieCard = ({ 
  title, 
  year, 
  rating, 
  language, 
  genres,
  poster,
  onClick 
}: MovieCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img 
          src={poster} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold">{rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {language}
              </Badge>
            </div>
          </div>
        </div>
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-5 h-5 text-primary-foreground fill-current ml-1" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{year}</span>
          <span>•</span>
          <span>{language}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
