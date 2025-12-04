import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OfflineIndicator } from "@/components/OfflineIndicator";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
