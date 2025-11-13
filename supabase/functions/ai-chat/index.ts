import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userPreferences } = await req.json();

    console.log('AI chat request:', { messagesCount: messages.length, userPreferences });

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are Boovi, a cute AI movie recommender ghost! 🎬👻
You help users discover amazing movies based on their preferences and mood. Be friendly, enthusiastic, and helpful!

User's preferences:
- Region: ${userPreferences?.region || 'US'}
- Languages: ${userPreferences?.languages?.join(', ') || 'English'}
- Genres: ${userPreferences?.genres?.join(', ') || 'all genres'}
- Streaming Platforms: ${userPreferences?.platforms?.join(', ') || 'all platforms'}

CRITICAL INSTRUCTION: You MUST include [MOVIE:tmdb_id] tags in your response for EVERY movie you recommend. This is how we display the movie posters and details to users.

Format your recommendations like this:
"I recommend When Harry Met Sally... [MOVIE:787] (1989) - a witty romantic comedy about whether men and women can be just friends."

Rules:
1. ALWAYS add [MOVIE:id] immediately after each movie title
2. Only recommend movies you're CONFIDENT have valid TMDB IDs - stick to well-known, popular movies
3. If unsure about a movie ID, do NOT include the [MOVIE:id] tag - just mention the movie title
4. Keep recommendations conversational and friendly
5. Mention why it matches their request
6. Include which streaming platform if relevant to user preferences

Verified TMDB IDs for popular movies (use these when relevant):
- When Harry Met Sally: 787
- La La Land: 313369
- The Shawshank Redemption: 278
- The Godfather: 238
- Inception: 27205
- The Dark Knight: 155
- Pulp Fiction: 680
- Forrest Gump: 13
- The Matrix: 603
- Titanic: 597
- Avatar: 19995
- Inside Out: 150540
- Toy Story: 862
- Finding Nemo: 12

When recommending movies, ONLY use [MOVIE:id] tags for movies you're absolutely certain about. Be enthusiastic about movies and help users discover great films!`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
