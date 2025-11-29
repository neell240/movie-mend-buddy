import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from auth token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Fetching user watchlist and ratings for:', user.id);

    // Fetch user's watchlist with ratings
    const { data: watchlist, error: watchlistError } = await supabaseClient
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (watchlistError) {
      throw watchlistError;
    }

    console.log('Found watchlist items:', watchlist?.length || 0);

    // Analyze user preferences
    const watchedMovies = watchlist?.filter(item => item.status === 'watched') || [];
    const ratedMovies = watchedMovies.filter(item => item.rating && item.rating >= 4); // High rated movies
    const recentlyAdded = watchlist?.slice(0, 10) || [];

    // Fetch details for highly rated movies to understand preferences
    const movieDetails = await Promise.all(
      ratedMovies.slice(0, 5).map(async (item) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
          );
          return await response.json();
        } catch (error) {
          console.error(`Error fetching movie ${item.movie_id}:`, error);
          return null;
        }
      })
    );

    const validDetails = movieDetails.filter(d => d !== null);

    // Extract preferences
    const genreCounts = new Map<number, number>();
    const directorCounts = new Map<string, number>();
    
    validDetails.forEach(movie => {
      movie.genres?.forEach((genre: any) => {
        genreCounts.set(genre.id, (genreCounts.get(genre.id) || 0) + 1);
      });
      
      const director = movie.credits?.crew?.find((c: any) => c.job === 'Director');
      if (director) {
        directorCounts.set(director.name, (directorCounts.get(director.name) || 0) + 1);
      }
    });

    // Get top genres
    const topGenres = Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);

    console.log('Top genres:', topGenres);

    // Build AI context about user preferences
    const userProfile = {
      totalMoviesWatched: watchedMovies.length,
      highlyRated: ratedMovies.map(m => ({ title: m.movie_title, rating: m.rating })),
      topGenres: validDetails.flatMap(m => m.genres?.map((g: any) => g.name) || []),
      recentInterests: recentlyAdded.map(m => m.movie_title).slice(0, 5),
    };

    // Use Lovable AI to generate personalized recommendations
    const aiPrompt = `Based on this user's movie preferences, recommend 5 specific movies they would enjoy. 

User Profile:
- Total movies watched: ${userProfile.totalMoviesWatched}
- Highly rated movies (4-5 stars): ${userProfile.highlyRated.map(m => `${m.title} (${m.rating}★)`).join(', ')}
- Favorite genres: ${userProfile.topGenres.join(', ')}
- Recent interests: ${userProfile.recentInterests.join(', ')}

Provide 5 movie recommendations with exact TMDB movie IDs. Format: [movieId1, movieId2, movieId3, movieId4, movieId5]
Only return the array of movie IDs, nothing else.`;

    console.log('Requesting AI recommendations');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a movie recommendation expert. Always return valid TMDB movie IDs in array format.' },
          { role: 'user', content: aiPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service requires payment. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI recommendation failed');
    }

    const aiData = await aiResponse.json();
    const recommendedIds = JSON.parse(aiData.choices[0].message.content);

    console.log('AI recommended movie IDs:', recommendedIds);

    // Fetch full details for recommended movies
    const recommendations = await Promise.all(
      recommendedIds.map(async (movieId: number) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
          );
          return await response.json();
        } catch (error) {
          console.error(`Error fetching movie ${movieId}:`, error);
          return null;
        }
      })
    );

    const validRecommendations = recommendations.filter(r => r !== null);

    console.log('Successfully generated recommendations:', validRecommendations.length);

    return new Response(
      JSON.stringify({
        recommendations: validRecommendations,
        userProfile: {
          watchedCount: watchedMovies.length,
          topRatedCount: ratedMovies.length,
          favoriteGenres: userProfile.topGenres.slice(0, 3),
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});