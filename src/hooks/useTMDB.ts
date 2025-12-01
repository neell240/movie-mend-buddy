import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TMDBResponse, TMDBMovieDetails } from '@/types/tmdb';
import { useOfflineSync } from './useOfflineSync';

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['trending-movies'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<TMDBResponse>('tmdb-trending');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: async () => {
      if (!query) return null;
      
      const { data, error } = await supabase.functions.invoke<TMDBResponse>('tmdb-search', {
        body: { query },
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!query,
  });
};

export const useMovieDetails = (movieId: string | undefined) => {
  const { isOnline, cacheMovie, getCachedMovie } = useOfflineSync();
  
  return useQuery({
    queryKey: ['movie-details', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      
      // If offline, return cached data
      if (!isOnline) {
        const cached = getCachedMovie(movieId);
        if (cached) return cached;
        throw new Error('Movie not available offline');
      }
      
      const { data, error } = await supabase.functions.invoke<TMDBMovieDetails>('tmdb-details', {
        body: { movieId },
      });
      
      if (error) throw error;
      
      // Cache the movie data for offline use
      if (data) {
        cacheMovie(movieId, data);
      }
      
      return data;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (previously cacheTime)
  });
};

export const useDiscoverMovies = (params?: { 
  genres?: number[];
  sortBy?: string;
  watchProviders?: number[];
  region?: string;
}) => {
  return useQuery({
    queryKey: ['discover-movies', params],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<TMDBResponse>('tmdb-discover', {
        body: params,
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!params,
  });
};
