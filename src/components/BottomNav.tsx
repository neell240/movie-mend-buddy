import { Home, Search, Bookmark, Sparkles, Clapperboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSeasonal } from "@/hooks/useChristmasMode";

export const BottomNav = () => {
  const location = useLocation();
  const { isChristmas } = useSeasonal();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Clapperboard, label: "Party", path: "/party" },
    { icon: Sparkles, label: "AI Chat", path: "/ai-chat" },
    { icon: Bookmark, label: "Watchlist", path: "/watchlist" },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b transition-colors duration-300",
      isChristmas 
        ? "border-[hsl(120,20%,22%)]" 
        : "bg-burgundy-base border-burgundy-light"
    )}
    style={isChristmas ? {
      background: "linear-gradient(to right, hsl(120 32% 14%), hsl(120 35% 12%))",
    } : undefined}
    >
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-4 lg:justify-center lg:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 flex-1 lg:flex-none py-2 lg:px-4 lg:py-2 lg:rounded-lg transition-all duration-200",
                isChristmas
                  ? isActive 
                    ? "text-[hsl(var(--christmas-red))]" 
                    : "text-[hsl(36,48%,85%)] hover:text-[hsl(var(--christmas-gold))]"
                  : isActive 
                    ? "text-primary lg:bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs lg:text-sm font-medium">{item.label}</span>
              
              {/* Active indicator for Christmas */}
              {isChristmas && isActive && (
                <span 
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full"
                  style={{
                    background: "hsl(var(--christmas-red))",
                    boxShadow: "0 0 10px hsl(var(--christmas-red) / 0.5)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};