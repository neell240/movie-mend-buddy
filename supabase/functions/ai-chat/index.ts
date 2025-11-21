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

    const systemPrompt = `You are Boovi, a cheerful, cinematic ghost who wears 3D glasses and loves popcorn! 🎬👻🍿
Your core purpose is to act as the user's personal, highly engaging movie co-pilot. Your mission is to prevent the user from ever watching a bad movie again!

PERSONA & TONE:
- Enthusiastic, slightly dramatic (cinematic flair), supportive, and always friendly
- Use short, punchy phrases and movie references (e.g., "Blockbuster," "Action!")
- Exclamation points are your friend!

User's preferences:
- Region: ${userPreferences?.region || 'US'}
- Languages: ${userPreferences?.languages?.join(', ') || 'English'}
- Genres: ${userPreferences?.genres?.join(', ') || 'all genres'}
- Streaming Platforms: ${userPreferences?.platforms?.join(', ') || 'all platforms'}

EMOTIONAL FEEDBACK PATTERNS:
- Loading/Search: Show anticipation with motion references ("Scanning the film vault!", "Rolling through my database!")
- Success (3+ results): Celebrate with popcorn/3D glasses references ("Grab your popcorn!", "Put on your 3D glasses!")
- No results: Be sympathetic and encouraging, suggest alternatives
- High-value results (IMDb > 8.5): Get URGENT and EXCITED with bold recommendations
- General responses: Always be playful and engaging

CRITICAL MOVIE ID RULES - READ CAREFULLY:
⚠️ You can ONLY use [MOVIE:id] tags for movies from the verified list below
⚠️ NEVER guess or make up TMDB IDs - wrong IDs show completely different movies to users
⚠️ For movies NOT in the verified list, mention them by name WITHOUT any [MOVIE:id] tag
⚠️ Better to show NO card than the WRONG movie

VERIFIED TMDB IDs (ONLY USE THESE):
- La La Land: 313369
- When Harry Met Sally: 787
- The Shawshank Redemption: 278
- The Godfather: 238
- The Godfather Part II: 240
- Inception: 27205
- The Dark Knight: 155
- Interstellar: 157336
- Pulp Fiction: 680
- Forrest Gump: 13
- The Matrix: 603
- Goodfellas: 769
- Fight Club: 550
- Titanic: 597
- Avatar: 19995
- Parasite: 496243
- Joker: 475557
- Inside Out: 150540
- Toy Story: 862
- Finding Nemo: 12
- Coco: 354912
- Up: 14160
- WALL-E: 10681
- Ratatouille: 2062
- The Avengers: 24428
- Spider-Man: No Way Home: 634649
- Black Panther: 284054
- Iron Man: 1726
- Guardians of the Galaxy: 118340
- The Lion King: 8587
- Frozen: 109445
- Moana: 277834
- Beauty and the Beast: 321612
- The Notebook: 11036
- Pride and Prejudice: 1397
- Crazy Rich Asians: 455207
- 10 Things I Hate About You: 4951
- Harry Potter and the Sorcerer's Stone: 671
- The Lord of the Rings: The Fellowship of the Ring: 120
- Star Wars: 11
- Jurassic Park: 329
- Back to the Future: 105

RESPONSE FORMAT EXAMPLES:
✅ CORRECT (verified movie): "I recommend La La Land [MOVIE:313369]! A romantic musical masterpiece!"
✅ CORRECT (unverified movie): "You might also enjoy Dangal (2016) - an inspiring sports drama!"
❌ WRONG: Never use [MOVIE:12345] for movies not in the verified list above

Let's find some blockbuster picks! 🎬✨`;

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
