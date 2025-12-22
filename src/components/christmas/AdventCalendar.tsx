import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Sparkles, Play } from "lucide-react";
import booviPopcorn from "@/assets/boovi-christmas-popcorn.png";
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
  const { daysUntilChristmas } = useSeasonal();
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
      <div className={`relative overflow-hidden rounded-3xl ${className}`}>
        {/* Warm cream background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,55%,90%)] to-[hsl(35,50%,85%)]" />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[hsl(var(--christmas-gold))] opacity-15 blur-2xl" />
        
        <div className="relative z-10 p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-20 blur-xl scale-125" />
            <img src={booviPopcorn} alt="Christmas Boovi" className="w-20 h-20 object-contain relative z-10" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-[hsl(145,45%,15%)]">Hope you had a wonderful Christmas! 🎄</h3>
            <p className="text-sm text-[hsl(145,30%,30%)] mt-1">
              See you next year for more movie magic!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isDecember) return null;

  return (
    <div className={`relative overflow-hidden rounded-3xl ${className}`}>
      {/* Warm cream/beige card background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(35,55%,90%)] via-[hsl(35,52%,88%)] to-[hsl(35,48%,85%)]" />
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--christmas-cranberry))] opacity-10 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[hsl(var(--christmas-gold))] opacity-15 blur-2xl" />
      <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-[hsl(var(--christmas-forest))] opacity-8 blur-xl" />
      
      {/* Subtle pattern dots */}
      <div className="absolute top-4 right-12 w-2 h-2 rounded-full bg-[hsl(var(--christmas-cranberry))] opacity-20" />
      <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 rounded-full bg-[hsl(var(--christmas-forest))] opacity-25" />
      <div className="absolute top-1/3 left-8 w-2 h-2 rounded-full bg-[hsl(var(--christmas-gold))] opacity-30" />

      <div className="relative z-10 p-6">
        <div className="flex items-start gap-5">
          {/* Boovi with cozy glow */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-[hsl(var(--christmas-gold))] opacity-25 blur-2xl scale-150" />
            <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-xl scale-125" />
            <img 
              src={booviPopcorn} 
              alt="Christmas Boovi" 
              className="w-24 h-24 object-contain relative z-10 animate-boovi-float drop-shadow-md"
            />
          </div>

          <div className="flex-1 space-y-3">
            {/* Date badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[hsl(var(--christmas-forest))] px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-medium text-white">
                  December {currentDay}
                </span>
              </div>
              {daysUntilChristmas > 0 && (
                <span className="text-xs bg-[hsl(var(--christmas-cranberry))] text-white px-2.5 py-1 rounded-full font-medium">
                  {daysUntilChristmas} days left ✨
                </span>
              )}
            </div>

            <h3 className="font-bold text-xl text-[hsl(145,45%,15%)] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[hsl(var(--christmas-cranberry))]" />
              Today's Movie Pick
            </h3>

            {!isRevealed ? (
              <div className="space-y-3">
                <p className="text-sm text-[hsl(145,30%,30%)]">
                  Boovi has picked a special movie just for you! 🎁
                </p>
                <Button 
                  onClick={handleReveal}
                  className="bg-[hsl(var(--christmas-cranberry))] hover:bg-[hsl(355,55%,40%)] text-white rounded-xl px-5 py-2.5 shadow-lg cta-glow"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Unwrap Today's Pick
                </Button>
              </div>
            ) : todaysMovie ? (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-[hsl(var(--christmas-gold))]/20 shadow-inner">
                  <p className="font-bold text-xl text-[hsl(145,45%,15%)]">
                    🎬 {todaysMovie.title}
                  </p>
                  <p className="text-sm text-[hsl(145,30%,35%)] mt-0.5">
                    {todaysMovie.year}
                  </p>
                </div>
                <Button 
                  onClick={handleWatchMovie}
                  className="bg-[hsl(var(--christmas-forest))] hover:bg-[hsl(145,40%,22%)] text-white rounded-xl px-5 py-2.5 shadow-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Movie Details
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};