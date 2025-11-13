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
    // Handle both GET (query params) and POST (body) requests
    const url = new URL(req.url);
    let movieId = url.searchParams.get('id');
    
    if (!movieId && req.method === 'POST') {
      const body = await req.json();
      movieId = body.movieId;
    }

    if (!movieId) {
      return new Response(
        JSON.stringify({ error: 'Movie ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Fetching movie details:', movieId);

    const [detailsResponse, creditsResponse, videosResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`)
    ]);

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text();
      console.error('TMDB API error:', detailsResponse.status, errorText);
      throw new Error(`TMDB API error: ${detailsResponse.status}`);
    }

    const details = await detailsResponse.json();
    const credits = await creditsResponse.json();
    const videos = await videosResponse.json();

    const result = {
      ...details,
      credits,
      videos
    };

    console.log('Successfully fetched movie details');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tmdb-details function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
