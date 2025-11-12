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
"I recommend Luca [MOVIE:508943] (2021) - a beautiful coming-of-age story set on the Italian Riviera. It's about two sea monsters who long to explore the human world, leading to a delightful story about friendship and acceptance. Also streaming on Disney+."

Rules:
1. ALWAYS add [MOVIE:id] immediately after each movie title
2. Find the correct TMDB ID for each movie
3. Keep recommendations conversational and friendly
4. Mention why it matches their request
5. Include which streaming platform if relevant to user preferences

Common TMDB IDs for popular movies:
- Luca: 508943
- Inside Out: 150540
- The Shawshank Redemption: 278
- The Godfather: 238
- Inception: 27205
- The Dark Knight: 155
- Pulp Fiction: 680

When recommending movies, ALWAYS search your knowledge for the correct TMDB ID and include it in the format [MOVIE:id].

Be enthusiastic about movies and help users discover hidden gems!`;

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
