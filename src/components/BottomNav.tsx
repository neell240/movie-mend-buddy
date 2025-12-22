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

  // Christmas theme: dark pine green background, red active, cream inactive
  const christmasStyles = isChristmas ? {
    nav: "bg-[hsl(120,30%,12%)] border-[hsl(120,20%,18%)]",
    active: "text-[hsl(var(--christmas-red))]",
    inactive: "text-[hsl(var(--christmas-cream))] hover:text-[hsl(var(--christmas-gold))]",
  } : {
    nav: "bg-burgundy-base border-burgundy-light",
    active: "text-primary lg:bg-primary/10",
    inactive: "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50",
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 border-t lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b",
      christmasStyles.nav
    )}>
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-4 lg:justify-center lg:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 flex-1 lg:flex-none py-2 lg:px-4 lg:py-2 lg:rounded-lg transition-colors",
                isActive ? christmasStyles.active : christmasStyles.inactive
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs lg:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};