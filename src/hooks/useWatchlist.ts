import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOfflineSync } from "./useOfflineSync";
import { useEffect } from "react";

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
  status: string;
  added_at: string;
  watched_at: string | null;
  rating: number | null;
  notes: string | null;
}

export const useWatchlist = () => {
  const queryClient = useQueryClient();
  const { isOnline, cacheWatchlist, getCachedWatchlist } = useOfflineSync();

  const { data: watchlist = [], isLoading, refetch } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // If offline, return cached data
      if (!isOnline) {
        return getCachedWatchlist();
      }

      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .order("added_at", { ascending: false });

      if (error) throw error;
      
      // Cache the watchlist data for offline use
      if (data) {
        cacheWatchlist(user.id);
      }
      
      return data as WatchlistItem[];
    },
  });

  // Sync watchlist when coming back online
  useEffect(() => {
    if (isOnline) {
      refetch();
    }
  }, [isOnline, refetch]);

  const addToWatchlist = useMutation({
    mutationFn: async (movie: { id: number; title: string; poster_path: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("watchlist")
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster: movie.poster_path,
          status: 'want_to_watch',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({
        title: "Added to watchlist!",
        description: "Movie has been added to your watchlist",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: "Already in watchlist",
          description: "This movie is already in your watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add to watchlist",
          variant: "destructive",
        });
      }
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (movieId: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({
        title: "Removed",
        description: "Movie removed from watchlist",
      });
    },
  });

  const markAsWatched = useMutation({
    mutationFn: async (movieId: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("watchlist")
        .update({
          status: 'watched',
          watched_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      toast({
        title: "Marked as watched!",
        description: "Movie marked as watched",
      });
    },
  });

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movie_id === movieId);
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    isInWatchlist,
    refetch,
  };
};
