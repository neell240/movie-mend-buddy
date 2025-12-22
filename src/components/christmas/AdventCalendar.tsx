import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Sparkles, Play } from "lucide-react";
import { ChristmasBoovi } from "./ChristmasBoovi";
import { useSeasonal } from "@/hooks/useChristmasMode";

// Daily Christmas movie picks (25 days)
const ADVENT_MOVIES = [
  { id: 771, title: "Home Alone", year: 1990 },
  { id: 627, title: "It's a Wonderful Life", year: 1946 },
  { id: 10719, title: "Elf", year: 2003 },
  { id: 13183, title: "The Polar Express", year: 2004 },
  { id: 10545, title: "How the Grinch Stole Christmas", year: 2000 },
  { id: 11970, title: "The Holiday", year: 2006 },
  { id: 12133, title: "A Christmas Story", year: 1983 },
  { id: 14564, title: "The Santa Clause", year: 1994 },
  { id: 10437, title: "The Nightmare Before Christmas", year: 1993 },
  { id: 12684, title: "Love Actually", year: 2003 },
  { id: 772, title: "Home Alone 2", year: 1992 },
  { id: 508965, title: "Klaus", year: 2019 },
  { id: 2593, title: "The Muppet Christmas Carol", year: 1992 },
  { id: 13673, title: "National Lampoon's Christmas Vacation", year: 1989 },
  { id: 34544, title: "Arthur Christmas", year: 2011 },
  { id: 9800, title: "Jingle All the Way", year: 1996 },
  { id: 14560, title: "Die Hard", year: 1988 },
  { id: 4148, title: "A Christmas Carol", year: 2009 },
  { id: 11395, title: "The Santa Clause 2", year: 2002 },
  { id: 17895, title: "Christmas with the Kranks", year: 2004 },
  { id: 823754, title: "Spirited", year: 2022 },
  { id: 3172, title: "Scrooged", year: 1988 },
  { id: 854, title: "The Family Man", year: 2000 },
  { id: 10140, title: "Miracle on 34th Street", year: 1994 },
  { id: 11546, title: "White Christmas", year: 1954 },
];

interface AdventCalendarProps {
  className?: string;
}

export const AdventCalendar = ({ className }: AdventCalendarProps) => {
  const navigate = useNavigate();
  const { daysUntilChristmas, isChristmasDay } = useSeasonal();
  const [today, setToday] = useState(new Date());
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeout = setTimeout(() => {
      setToday(new Date());
      setIsRevealed(false);
    }, tomorrow.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, [today]);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  
  const isDecember = currentMonth === 11;
  const dayIndex = Math.min(currentDay - 1, 24);
  const todaysMovie = isDecember && currentDay <= 25 ? ADVENT_MOVIES[dayIndex] : null;

  const handleReveal = () => setIsRevealed(true);

  const handleWatchMovie = () => {
    if (todaysMovie) {
      navigate(`/movie/${todaysMovie.id}`);
    }
  };

  // After Christmas
  if (currentMonth === 11 && currentDay > 25) {
    return (
      <div className={`bg-card rounded-2xl p-5 ${className}`}>
        <div className="flex items-center gap-4">
          <ChristmasBoovi size="md" />
          <div>
            <h3 className="font-bold text-lg text-card-foreground">Hope you had a Merry Christmas! 🎄</h3>
            <p className="text-sm text-card-foreground/70">
              See you next year for more movie magic!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDecember) return null;

  return (
    <div className={`bg-card rounded-2xl p-5 shadow-lg overflow-hidden ${className}`}>
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 text-4xl opacity-10">🎄</div>
        <div className="absolute -bottom-4 -left-4 text-4xl opacity-10">🎁</div>

        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0">
            <ChristmasBoovi size="lg" showGlow={isRevealed} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-4 h-4 text-[hsl(var(--christmas-wine))]" />
              <span className="text-sm font-medium text-card-foreground/70">
                December {currentDay}
              </span>
              {daysUntilChristmas > 0 && (
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                  {daysUntilChristmas} days left
                </span>
              )}
            </div>

            <h3 className="font-bold text-lg text-card-foreground flex items-center gap-2">
              <Gift className="w-5 h-5 text-[hsl(var(--christmas-wine))]" />
              Today's Christmas Movie Pick
            </h3>

            {!isRevealed ? (
              <div className="space-y-3">
                <p className="text-sm text-card-foreground/70">
                  Boovi has a special movie for you today!
                </p>
                <Button 
                  onClick={handleReveal}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground cta-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reveal Today's Pick
                </Button>
              </div>
            ) : todaysMovie ? (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
                  <p className="font-semibold text-lg text-card-foreground">
                    🎁 {todaysMovie.title}
                  </p>
                  <p className="text-sm text-card-foreground/70">
                    ({todaysMovie.year})
                  </p>
                </div>
                <Button 
                  onClick={handleWatchMovie}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Movie
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};