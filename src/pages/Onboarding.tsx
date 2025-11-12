import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import booviAvatar from "@/assets/boovi-avatar.png";
import { ChevronRight } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: "🎉 Welcome to MovieMent!",
      subtitle: "Your personal movie and entertainment hub.",
      buttonText: "Let's Begin 🍿",
      visual: (
        <div className="relative flex justify-center items-center h-64 animate-fade-in">
          <div className="text-8xl animate-bounce">🎬</div>
        </div>
      ),
    },
    {
      title: "🎥 Discover Movies You'll Love",
      subtitle: "AI-powered recommendations just for you. Find your next favorite movie in seconds.",
      buttonText: "Next",
      visual: (
        <div className="relative h-64 overflow-hidden animate-fade-in">
          <div className="flex gap-4 animate-slide-in-right">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="min-w-[120px] h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-border"
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "📝 Build Your Watchlist",
      subtitle: "Save movies to your wishlist. Never forget what you want to watch next!",
      buttonText: "Next",
      visual: (
        <div className="relative flex flex-col items-center h-64 animate-fade-in gap-4">
          <div className="text-6xl">📝</div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="h-12 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg border border-border animate-scale-in flex items-center px-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded mr-3" />
                <div className="flex-1 h-4 bg-primary/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "▶️ Watch Trailers Instantly",
      subtitle: "Watch trailers right here. Get a taste before you hit play.",
      buttonText: "Next",
      visual: (
        <div className="relative flex justify-center items-center h-64 animate-fade-in">
          <div className="w-48 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-border flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center animate-pulse">
              <ChevronRight className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "👻 Hi, I'm Boovi!",
      subtitle: "Your AI movie recommender — here to help you find the perfect film for any mood.",
      buttonText: "Let's Go!",
      visual: (
        <div className="relative flex justify-center items-center h-64 animate-fade-in">
          <img 
            src={booviAvatar} 
            alt="Boovi" 
            className="w-40 h-40 animate-scale-in"
          />
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigate("/");
    }
  };

  const screen = screens[currentScreen];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8 pb-8">
          <div className="space-y-6">
            {screen.visual}
            
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold">{screen.title}</h2>
              <p className="text-muted-foreground">{screen.subtitle}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-4">
              {screens.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentScreen 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-primary/20"
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full"
              size="lg"
            >
              {screen.buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
