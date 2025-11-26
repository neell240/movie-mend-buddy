import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_poster: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting notification scheduler...');

    // Get all users with watchlist items
    const { data: watchlistItems, error: watchlistError } = await supabase
      .from('watchlist')
      .select('*')
      .eq('status', 'want_to_watch');

    if (watchlistError) {
      console.error('Error fetching watchlist:', watchlistError);
      throw watchlistError;
    }

    console.log(`Found ${watchlistItems?.length || 0} watchlist items`);

    // Check for new trailers for watchlist items
    const notificationsToCreate = [];
    
    for (const item of watchlistItems || []) {
      try {
        // Fetch movie details from TMDB including videos
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${tmdbApiKey}&append_to_response=videos`
        );
        
        if (!movieResponse.ok) {
          console.error(`Failed to fetch movie ${item.movie_id}`);
          continue;
        }

        const movieData = await movieResponse.json();
        
        // Check if there are any trailers
        const trailers = movieData.videos?.results?.filter(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        ) || [];

        // Check if movie has been released recently (within last 7 days)
        const releaseDate = new Date(movieData.release_date);
        const now = new Date();
        const daysSinceRelease = Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceRelease >= 0 && daysSinceRelease <= 7) {
          // Check if we already sent this notification
          const { data: existingNotification } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', item.user_id)
            .eq('type', 'new_release')
            .ilike('message', `%${item.movie_title}%`)
            .single();

          if (!existingNotification) {
            notificationsToCreate.push({
              user_id: item.user_id,
              title: '🎬 New Release Alert!',
              message: `"${item.movie_title}" is now available! Time to watch it.`,
              type: 'new_release',
            });
          }
        }

        // Notify about new trailers if any
        if (trailers.length > 0) {
          // Check if we already sent trailer notification
          const { data: existingTrailerNotif } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', item.user_id)
            .eq('type', 'new_trailer')
            .ilike('message', `%${item.movie_title}%`)
            .single();

          if (!existingTrailerNotif) {
            notificationsToCreate.push({
              user_id: item.user_id,
              title: '🎥 New Trailer Available!',
              message: `Check out the new trailer for "${item.movie_title}" on your watchlist!`,
              type: 'new_trailer',
            });
          }
        }

      } catch (error) {
        console.error(`Error processing movie ${item.movie_id}:`, error);
      }
    }

    // Create AI recommendation notifications for active users
    const { data: recentConversations } = await supabase
      .from('conversations')
      .select('user_id')
      .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('updated_at', { ascending: false });

    const activeUsers = [...new Set(recentConversations?.map(c => c.user_id) || [])];

    for (const userId of activeUsers) {
      // Check if we sent a recommendation notification in the last 3 days
      const { data: recentRecommendation } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'recommendation')
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .single();

      if (!recentRecommendation) {
        notificationsToCreate.push({
          user_id: userId,
          title: '✨ Boovi has new picks!',
          message: 'Chat with Boovi to discover fresh movie recommendations tailored just for you!',
          type: 'recommendation',
        });
      }
    }

    // Bulk insert notifications
    if (notificationsToCreate.length > 0) {
      console.log(`Creating ${notificationsToCreate.length} notifications`);
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notificationsToCreate);

      if (insertError) {
        console.error('Error inserting notifications:', insertError);
        throw insertError;
      }
    }

    console.log('Notification scheduler completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        notificationsCreated: notificationsToCreate.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in notification scheduler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
