import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
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
    // Update date at midnight
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
  
  // Only show during December
  const isDecember = currentMonth === 11;
  const dayIndex = Math.min(currentDay - 1, 24); // 0-24 for Dec 1-25
  
  // Show countdown or movie depending on the day
  const todaysMovie = isDecember && currentDay <= 25 ? ADVENT_MOVIES[dayIndex] : null;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleWatchMovie = () => {
    if (todaysMovie) {
      navigate(`/movie/${todaysMovie.id}`);
    }
  };

  // After Christmas
  if (currentMonth === 11 && currentDay > 25) {
    return (
      <Card className={`p-6 bg-gradient-to-br from-christmas-red/10 to-christmas-green/10 border-christmas-red/20 ${className}`}>
        <div className="flex items-center gap-4">
          <ChristmasBoovi mood="cozy" size="md" />
          <div>
            <h3 className="font-bold text-lg">Hope you had a Merry Christmas! 🎄</h3>
            <p className="text-sm text-muted-foreground">
              See you next year for more movie magic!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Before December or non-December
  if (!isDecember) {
    return null;
  }

  return (
    <Card className={`p-6 bg-gradient-to-br from-christmas-red/10 via-background to-christmas-green/10 border-christmas-red/20 overflow-hidden ${className}`}>
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 text-4xl opacity-20">🎄</div>
        <div className="absolute -bottom-4 -left-4 text-4xl opacity-20">🎁</div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ChristmasBoovi 
              mood={isRevealed ? "excited" : "happy"} 
              size="lg" 
              showSparkles={isRevealed}
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-christmas-red" />
              <span className="text-sm font-medium text-muted-foreground">
                December {currentDay}
              </span>
              {daysUntilChristmas > 0 && (
                <span className="text-xs bg-christmas-green/20 text-christmas-green px-2 py-0.5 rounded-full">
                  {daysUntilChristmas} days until Christmas
                </span>
              )}
            </div>

            <h3 className="font-bold text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 text-christmas-red" />
              🎁 Today's Christmas Movie Pick
            </h3>

            {!isRevealed ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Boovi has a special movie recommendation for you today!
                </p>
                <Button 
                  onClick={handleReveal}
                  className="bg-christmas-red hover:bg-christmas-red/90 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reveal Today's Pick
                </Button>
              </div>
            ) : todaysMovie ? (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-background/50 rounded-lg p-4 border border-christmas-green/20">
                  <p className="font-semibold text-lg text-foreground">
                    {todaysMovie.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({todaysMovie.year})
                  </p>
                </div>
                <Button 
                  onClick={handleWatchMovie}
                  variant="outline"
                  className="border-christmas-green text-christmas-green hover:bg-christmas-green/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Movie Details
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
};
