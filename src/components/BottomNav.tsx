import { Home, Search, Bookmark, User, Sparkles, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Users, label: "Social", path: "/social" },
    { icon: Sparkles, label: "AI Chat", path: "/ai-chat" },
    { icon: Bookmark, label: "Watchlist", path: "/watchlist" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-burgundy-base border-t border-burgundy-light lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b">
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
                isActive ? "text-primary lg:bg-primary/10" : "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50"
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
