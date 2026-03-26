import { useState } from "react";
import { Home, Search, Bookmark, Sparkles, Users, Film, Flame } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSeasonal } from "@/hooks/useChristmasMode";
import { motion } from "framer-motion";

export const BottomNav = () => {
  const location = useLocation();
  const { isChristmas, isRamNavami } = useSeasonal();
  const [tappedItem, setTappedItem] = useState<string | null>(null);
  
  const baseItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Sparkles, label: "AI Chat", path: "/ai-chat" },
    { icon: Bookmark, label: "Watchlist", path: "/watchlist" },
  ];

  const navItems = isRamNavami
    ? [
        ...baseItems,
        { icon: Flame, label: "Ram Navami", path: "/ram-navami-movies" },
      ]
    : [
        ...baseItems,
        { icon: Users, label: "Social", path: "/social" },
      ];

  const handleTap = (path: string) => {
    setTappedItem(path);
    setTimeout(() => setTappedItem(null), 300);
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b transition-colors duration-300",
        isRamNavami
          ? "border-[hsl(25,30%,75%)]"
          : isChristmas 
            ? "border-[hsl(355,40%,25%)]" 
            : "bg-burgundy-base border-burgundy-light"
      )}
      style={isRamNavami ? {
        background: "linear-gradient(to right, hsl(20 25% 22%), hsl(15 28% 18%), hsl(20 25% 22%))",
        boxShadow: "0 -4px 16px hsl(20 30% 10% / 0.4)",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
      } : isChristmas ? {
        background: "linear-gradient(to right, hsl(355 50% 16%), hsl(355 45% 14%), hsl(355 50% 16%))",
        boxShadow: "0 -4px 20px hsl(355 50% 6% / 0.5)",
      } : undefined}
    >
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-4 lg:justify-center lg:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isTapped = tappedItem === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleTap(item.path)}
              className={cn(
                "relative flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 flex-1 lg:flex-none py-2 lg:px-4 lg:py-2 lg:rounded-lg transition-all duration-200",
                isRamNavami
                  ? isActive
                    ? "text-[hsl(35,70%,65%)]"
                    : "text-[hsl(30,20%,60%)] hover:text-[hsl(35,50%,70%)]"
                  : isChristmas
                    ? isActive 
                      ? "text-amber-300" 
                      : "text-amber-100 hover:text-amber-200"
                    : isActive 
                      ? "text-accent lg:bg-accent/10" 
                      : "text-muted-foreground hover:text-foreground lg:hover:bg-muted/50"
              )}
            >
              <motion.div
                animate={isTapped ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : {}}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-xs lg:text-sm font-medium">{item.label}</span>
              
              {/* Active indicator - gold underline */}
              {isActive && (
                <motion.span 
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, hsl(42 85% 60%), hsl(42 85% 50%), hsl(42 85% 60%))",
                    boxShadow: "0 0 12px hsl(42 85% 60% / 0.6), 0 0 24px hsl(42 85% 60% / 0.3)",
                  }}
                  layoutId="nav-indicator"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.35 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
