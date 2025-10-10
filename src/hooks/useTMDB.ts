import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TMDBResponse, TMDBMovieDetails } from '@/types/tmdb';

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
  return useQuery({
    queryKey: ['movie-details', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      
      const { data, error } = await supabase.functions.invoke<TMDBMovieDetails>('tmdb-details', {
        body: { movieId },
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!movieId,
  });
};

export const useDiscoverMovies = (genres?: number[], sortBy?: string) => {
  return useQuery({
    queryKey: ['discover-movies', genres, sortBy],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<TMDBResponse>('tmdb-discover', {
        body: { genres, sortBy },
      });
      
      if (error) throw error;
      return data;
    },
  });
};
