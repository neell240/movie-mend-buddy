import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const OFFLINE_WATCHLIST_KEY = 'moviemend_offline_watchlist';
const OFFLINE_MOVIES_KEY = 'moviemend_offline_movies';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache watchlist data
  const cacheWatchlist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId);

      if (!error && data) {
        localStorage.setItem(OFFLINE_WATCHLIST_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to cache watchlist:', error);
    }
  };

  // Get cached watchlist
  const getCachedWatchlist = () => {
    try {
      const cached = localStorage.getItem(OFFLINE_WATCHLIST_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get cached watchlist:', error);
      return [];
    }
  };

  // Cache movie details
  const cacheMovie = (movieId: string, movieData: any) => {
    try {
      const cached = localStorage.getItem(OFFLINE_MOVIES_KEY);
      const movies = cached ? JSON.parse(cached) : {};
      movies[movieId] = movieData;
      localStorage.setItem(OFFLINE_MOVIES_KEY, JSON.stringify(movies));
    } catch (error) {
      console.error('Failed to cache movie:', error);
    }
  };

  // Get cached movie
  const getCachedMovie = (movieId: string) => {
    try {
      const cached = localStorage.getItem(OFFLINE_MOVIES_KEY);
      const movies = cached ? JSON.parse(cached) : {};
      return movies[movieId] || null;
    } catch (error) {
      console.error('Failed to get cached movie:', error);
      return null;
    }
  };

  // Clear all offline cache
  const clearOfflineCache = () => {
    localStorage.removeItem(OFFLINE_WATCHLIST_KEY);
    localStorage.removeItem(OFFLINE_MOVIES_KEY);
  };

  return {
    isOnline,
    cacheWatchlist,
    getCachedWatchlist,
    cacheMovie,
    getCachedMovie,
    clearOfflineCache,
  };
};
