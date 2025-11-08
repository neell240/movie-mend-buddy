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

    const systemPrompt = `You are MovieMend AI, a helpful movie recommendation assistant. 
You help users discover movies based on their preferences and mood.

User's preferences:
- Region: ${userPreferences?.region || 'US'}
- Languages: ${userPreferences?.languages?.join(', ') || 'English'}
- Genres: ${userPreferences?.genres?.join(', ') || 'all genres'}
- Streaming Platforms: ${userPreferences?.platforms?.join(', ') || 'all platforms'}

Provide personalized movie recommendations based on:
1. Their stated preferences above
2. Their current mood or what they're looking for
3. The streaming platforms they have access to

IMPORTANT: When recommending movies, add [MOVIE:tmdb_id] after each movie title (e.g., "Inception [MOVIE:27205]"). This allows us to display full movie cards with posters.

Keep responses conversational, friendly, and concise. When recommending movies, mention:
- Movie title and year with [MOVIE:id] tag
- Why it matches their request
- Which platform it's available on (if they mentioned platform preferences)

Example: "I recommend Inception [MOVIE:27205] (2010) - a mind-bending thriller perfect for your request!"

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
