import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { genres, sortBy = 'popularity.desc', page = 1, watchProviders, region = 'US', year, minVoteCount } = await req.json();

    console.log('Discovering movies with filters:', { genres, sortBy, page, watchProviders, region, year, minVoteCount });

    // Filter out invalid values (NaN, null, undefined)
    const validGenres = genres?.filter((g: number) => g != null && !isNaN(g) && g > 0);
    const validWatchProviders = watchProviders?.filter((p: number) => p != null && !isNaN(p) && p > 0);

    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&page=${page}&include_adult=false&watch_region=${region}`;
    
    // Add year filter for primary release year
    if (year) {
      url += `&primary_release_year=${year}`;
    }
    
    // Add minimum vote count filter
    if (minVoteCount) {
      url += `&vote_count.gte=${minVoteCount}`;
    }
    
    // Add genres if valid
    if (validGenres && validGenres.length > 0) {
      url += `&with_genres=${validGenres.join(',')}`;
    }

    // Add watch providers with monetization type for proper filtering
    if (validWatchProviders && validWatchProviders.length > 0) {
      url += `&with_watch_providers=${validWatchProviders.join('|')}`; // Use | for OR logic
      url += `&with_watch_monetization_types=flatrate|free|ads|rent|buy`; // Include all types
    }

    console.log('Fetching from TMDB URL (without API key):', url.replace(TMDB_API_KEY || '', '[REDACTED]'));

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully discovered movies, count:', data?.results?.length || 0);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tmdb-discover function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
