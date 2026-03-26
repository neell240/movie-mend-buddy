import { useState, useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ChristmasProvider } from "@/hooks/useChristmasMode";
import { ChristmasWrapper } from "@/components/christmas/ChristmasWrapper";
import { RamNavamiWelcome } from "@/components/ramnavami/RamNavamiWelcome";
import { useSeasonal } from "@/hooks/useChristmasMode";

import { PWASplashScreen } from "@/components/PWASplashScreen";
import Index from "./pages/Index";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Filters from "./pages/Filters";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import Settings from "./pages/Settings";
import AIChat from "./pages/AIChat";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import Social from "./pages/Social";
import Install from "./pages/Install";
import BooviDemo from "./pages/BooviDemo";
import ChristmasMovies from "./pages/ChristmasMovies";
import RamNavamiMoviesPage from "./pages/RamNavamiMovies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
// Gate component that uses seasonal context
const RamNavamiWelcomeGate = () => {
  const { isRamNavami } = useSeasonal();
  if (!isRamNavami) return null;
  return <RamNavamiWelcome />;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true;
    setIsStandalone(isPWA);
    
    // Only show splash for PWA or first visit
    if (!isPWA) {
      const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
      if (hasSeenSplash) {
        setShowSplash(false);
      }
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ChristmasProvider>
        <TooltipProvider>
          {showSplash && (
            <PWASplashScreen 
              onComplete={handleSplashComplete}
              minDisplayTime={isStandalone ? 2500 : 1800}
            />
          )}
          <ChristmasWrapper />
          <RamNavamiWelcomeGate />
          
          <OfflineIndicator />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/filters" element={<Filters />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/social" element={<Social />} />
              <Route path="/install" element={<Install />} />
              <Route path="/boovi-demo" element={<BooviDemo />} />
              <Route path="/christmas-movies" element={<ChristmasMovies />} />
              <Route path="/ram-navami-movies" element={<RamNavamiMoviesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ChristmasProvider>
    </QueryClientProvider>
  );
};


export default App;
