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
    const { state } = await req.json();

    console.log('Generating Boovi state:', state);

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompts = {
      celebrating: "A cute cheerful ghost mascot named Boovi wearing shiny 3D glasses, holding a bucket of popcorn, celebrating with confetti and sparkles, very happy expression, floating excitedly, cartoon style, transparent background",
      sympathetic: "A cute empathetic ghost mascot named Boovi wearing 3D glasses, holding popcorn, with a warm caring expression, slight head tilt, comforting pose, cartoon style, transparent background",
      excited: "A cute energetic ghost mascot named Boovi wearing 3D glasses, holding popcorn bucket high in the air, very excited expression with wide eyes, dynamic pose with motion lines, cartoon style, transparent background",
      focused: "A cute focused ghost mascot named Boovi wearing 3D glasses, holding popcorn, searching or scanning pose with determined expression, slight forward lean, cartoon style, transparent background",
      idle: "A cute playful ghost mascot named Boovi wearing 3D glasses, casually holding popcorn, friendly waving gesture, welcoming expression, cartoon style, transparent background"
    };

    const prompt = prompts[state as keyof typeof prompts] || prompts.idle;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          { role: 'user', content: prompt }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ imageUrl, state }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-boovi-state function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
