export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  popularity: number;
  adult: boolean;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZE = 'w500';
export const TMDB_BACKDROP_SIZE = 'w1280';
export const TMDB_PROFILE_SIZE = 'w185';

export const getTMDBImageUrl = (path: string | null, size: string = TMDB_POSTER_SIZE): string => {
  if (!path) return 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
